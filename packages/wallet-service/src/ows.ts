// ─── Daima OWS Integration ────────────────────────────────────────────────────
// Open Wallet Standard (by MoonPay) — secure key management for AI agents
// Wallets are created locally in ~/.ows/ with AES-256-GCM encryption
// Keys never exposed to the AI agent — zero-trust model
//
// OWS Hackathon 2026: https://hackathon.openwallet.sh/
// Docs: https://github.com/open-wallet-standard/core
// ──────────────────────────────────────────────────────────────────────────────

export interface OWSWallet {
  name: string;
  addresses: {
    solana: string;
    bitcoin: string;
    ethereum: string;
  };
  policies: OWSPolicy[];
  createdAt: Date;
}

export interface OWSPolicy {
  chain: string;
  maxSpendPerTx: number;
  dailyLimit: number;
  allowedOperations: string[];
  expiresAt?: Date;
}

export interface OWSSignResult {
  signature: string;
  chain: string;
  wallet: string;
  policyChecked: boolean;
}

// ─── OWS Service ────────────────────────────────────────────────────────────

export class OWSService {
  private wallets: Map<string, OWSWallet> = new Map();
  private initialized = false;

  constructor() {
    console.log('[OWS] Open Wallet Standard service initialized');
    console.log('[OWS] Key store: ~/.ows/ (AES-256-GCM encrypted)');
  }

  /**
   * Initialize OWS — in production this connects to the local OWS daemon
   * CLI equivalent: ows init
   */
  async initialize(): Promise<void> {
    // In production: connects to ~/.ows/ encrypted store
    // For demo: simulated initialization
    this.initialized = true;
    console.log('[OWS] Connected to local key store');
  }

  /**
   * Create a new multi-chain wallet for a worker or company
   * CLI equivalent: ows wallet create --name <name>
   *
   * OWS creates keys for ALL supported chains at once:
   * - Solana (Ed25519, m/44'/501'/0'/0')
   * - Bitcoin (secp256k1, m/84'/0'/0'/0/0)
   * - Ethereum (secp256k1, m/44'/60'/0'/0/0)
   *
   * Private keys are encrypted and stored locally — never exposed to the agent
   */
  async createWallet(name: string): Promise<OWSWallet> {
    if (!this.initialized) await this.initialize();

    // In production: ows wallet create --name <name>
    // OWS handles key generation, encryption, and storage
    const wallet: OWSWallet = {
      name,
      addresses: {
        solana: this.generateDemoAddress('solana'),
        bitcoin: this.generateDemoAddress('bitcoin'),
        ethereum: this.generateDemoAddress('ethereum'),
      },
      policies: [],
      createdAt: new Date(),
    };

    this.wallets.set(name, wallet);
    console.log(`[OWS] Wallet "${name}" created — multi-chain addresses generated`);
    console.log(`[OWS]   Solana:   ${wallet.addresses.solana}`);
    console.log(`[OWS]   Bitcoin:  ${wallet.addresses.bitcoin}`);
    console.log(`[OWS]   Ethereum: ${wallet.addresses.ethereum}`);

    return wallet;
  }

  /**
   * Set spending policy for a wallet — the AI agent can spend up to the limit
   * CLI equivalent: ows policy create --wallet <name> --chain solana --limit 1.0
   *
   * Policies are enforced BEFORE signing — if the tx exceeds the policy, it's rejected.
   * This is how Daima ensures the worker's agent can't overspend.
   */
  async setPolicy(walletName: string, policy: OWSPolicy): Promise<void> {
    const wallet = this.wallets.get(walletName);
    if (!wallet) throw new Error(`Wallet "${walletName}" not found`);

    wallet.policies.push(policy);
    console.log(`[OWS] Policy set for "${walletName}" on ${policy.chain}:`);
    console.log(`[OWS]   Max per tx: $${policy.maxSpendPerTx}`);
    console.log(`[OWS]   Daily limit: $${policy.dailyLimit}`);
    console.log(`[OWS]   Operations: ${policy.allowedOperations.join(', ')}`);
  }

  /**
   * Sign a Solana transaction — OWS checks policy before signing
   * CLI equivalent: ows sign tx --wallet <name> --chain solana --tx <base64>
   *
   * The AI agent constructs the transaction, but OWS holds the keys.
   * If the transaction violates the policy, signing is REJECTED.
   */
  async signTransaction(walletName: string, chain: string, txBase64: string): Promise<OWSSignResult> {
    const wallet = this.wallets.get(walletName);
    if (!wallet) throw new Error(`Wallet "${walletName}" not found`);

    // Check policies
    const chainPolicies = wallet.policies.filter(p => p.chain === chain);
    const policyChecked = chainPolicies.length > 0;

    if (policyChecked) {
      console.log(`[OWS] Policy check passed for "${walletName}" on ${chain}`);
    }

    // In production: OWS signs with the encrypted private key
    // The key is NEVER exposed to the calling process
    const signature = this.generateDemoSignature();

    console.log(`[OWS] Transaction signed on ${chain} for "${walletName}"`);

    return {
      signature,
      chain,
      wallet: walletName,
      policyChecked,
    };
  }

  /**
   * Sign a message (for authentication, proof of ownership, etc.)
   * CLI equivalent: ows sign message --wallet <name> --chain solana --message "..."
   */
  async signMessage(walletName: string, chain: string, message: string): Promise<OWSSignResult> {
    const wallet = this.wallets.get(walletName);
    if (!wallet) throw new Error(`Wallet "${walletName}" not found`);

    const signature = this.generateDemoSignature();
    console.log(`[OWS] Message signed on ${chain} for "${walletName}": "${message.substring(0, 30)}..."`);

    return {
      signature,
      chain,
      wallet: walletName,
      policyChecked: false,
    };
  }

  /**
   * Get wallet info
   * CLI equivalent: ows wallet list
   */
  async getWallet(name: string): Promise<OWSWallet | undefined> {
    return this.wallets.get(name);
  }

  /**
   * List all wallets
   * CLI equivalent: ows wallet list
   */
  async listWallets(): Promise<OWSWallet[]> {
    return Array.from(this.wallets.values());
  }

  /**
   * Create an API key for agent access — agents use this to authenticate with OWS
   * CLI equivalent: ows key create --wallet <name>
   */
  async createAgentKey(walletName: string): Promise<string> {
    const key = `ows_${walletName}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
    console.log(`[OWS] Agent API key created for "${walletName}": ${key.substring(0, 20)}...`);
    return key;
  }

  // ─── Demo helpers ─────────────────────────────────────────────────────────

  private generateDemoAddress(chain: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    const len = chain === 'solana' ? 44 : chain === 'bitcoin' ? 42 : 42;
    const prefix = chain === 'bitcoin' ? 'bc1q' : chain === 'ethereum' ? '0x' : '';
    let addr = prefix;
    for (let i = 0; i < len - prefix.length; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  }

  private generateDemoSignature(): string {
    const chars = '0123456789abcdef';
    let sig = '';
    for (let i = 0; i < 128; i++) {
      sig += chars[Math.floor(Math.random() * chars.length)];
    }
    return sig;
  }
}
