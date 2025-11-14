# YCD Bank Web App

Modern banking dashboard prototype that lets users manage accounts, cards, beneficiaries, transfers, and transactions directly in the browser using local storage. Built as a front-end experience with polished Tailwind UI components.

## Installation

```bash
git clone https://github.com/anasselghazi/Ycd-Bank.git
cd Ycd-Bank
```

Open `Code/index.html` with Live Server or directly in your browser.

## Usage

1. Register a user via `Code/auth/Register/register.html`.
2. Log in through `Code/auth/login.html`.
3. Access dashboard features:
   - Manage cards (`Code/pages/dashboard/cartes.html`)
   - Create transfers (`Code/pages/dashboard/virement.html`)
   - Track transactions (`Code/pages/dashboard/transaction.html`)

All data persists in `localStorage` through `Code/script/modules/storage.js`, so no backend is required.

## Features

- Secure login/register flow using local storage sessions
- Interactive dashboard with balances, transactions, and quick actions
- Beneficiary management + smart search & RIB paste support
- Transfers between accounts (auto-reroute when the card is blocked)
- Card management (block/unblock, limit setting, principal vs épargne view)
- Transaction history with pagination and search filters
- Multiple Tailwind-based dashboards: conversions, devices, facture, etc.

## Tech Stack

- HTML5 + Tailwind CSS
- Vanilla JavaScript ES Modules
- LocalStorage persistence (`Code/script/modules/storage.js`)
- Modular architecture (`Code/script/modules/*.js`)

## Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create a feature branch  
3. Submit a PR with a clear description and screenshots

## License

MIT License

## Credits

Team: Ilyas Doughmi, Aya Nakkabi, Anas Elghazi  
UI inspiration from various Tailwind dashboard templates.

---
