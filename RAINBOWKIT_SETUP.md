# RainbowKit Wallet Integration Guide

Your project now has RainbowKit integrated for Web3 wallet connections. Here's what was set up and how to use it.

## What's Installed

- **@rainbow-me/rainbowkit** - Beautiful wallet connection interface
- **wagmi** - Ethereum interaction library  
- **viem** - Low-level Ethereum library
- **@tanstack/react-query** - Required dependency

## Setup Location

The RainbowKit configuration is in these files:

- [wagmiConfig.js](src/wagmiConfig.js) - Wagmi and RainbowKit configuration
- [main.jsx](src/main.jsx) - Providers setup
- [App.jsx](src/App.jsx) - ConnectButton component integration

## Configuration Required

1. **Get a WalletConnect Project ID** (Required for production):
   - Visit https://cloud.walletconnect.com/
   - Create a project
   - Copy your Project ID
   - Update [wagmiConfig.js](src/wagmiConfig.js):
     ```javascript
     projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Replace with your ID
     ```

2. **Supported Networks** (already configured):
   - Mainnet (Ethereum)
   - Polygon
   - Optimism
   - Arbitrum
   - Base
   - Sepolia (testnet)

   Add or remove networks in [wagmiConfig.js](src/wagmiConfig.js) as needed.

## Usage

The `<ConnectButton />` component from RainbowKit is now in your app header. It provides:
- Wallet connection/disconnection
- Network switching
- Account display
- Balance information

## Accessing Wallet Data

Use the `useAccount` hook in any component:

```javascript
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address, isConnected, chain } = useAccount();
  
  return (
    <div>
      {isConnected && (
        <p>Connected: {address}</p>
      )}
    </div>
  );
}
```

## Development

Run the dev server:
```bash
npm run build  # Production build
npm run dev    # Development with hot reload
```

## Next Steps

1. Get a WalletConnect Project ID
2. Add it to [wagmiConfig.js](src/wagmiConfig.js)
3. Build and deploy your application
4. Test wallet connections on your network

## Documentation

- RainbowKit Docs: https://rainbowkit.com/
- Wagmi Docs: https://wagmi.sh/
- WalletConnect: https://walletconnect.com/

## Notes

- The project uses `legacy-peer-deps` due to version compatibility
- Update package.json and reinstall if changing dependency versions
- For testing without a Project ID, RainbowKit will work in development mode
