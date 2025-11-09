// script.js - FULLY WORKING (ABIs yaha paste karna)

// === CONFIG ===
const CONFIG = {
    USDC: "0xAeA395991357425d3BAcb5C3E8600B31ae7f9d21",
    EURC: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
    STABLE_SWAP_CONTRACT: "0x2ad8A5F51977C91E575bD81366A30cdC56DE64Bf",
    CHAIN_ID: 5042002,
    RPC_URL: "https://rpc.testnet.arc.network"
};

// === PASTE ABIs HERE ===
const STABLE_SWAP_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "_usdc", "type": "address"},
            {"internalType": "address", "name": "_eurc", "type": "address"}
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "addEURCLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "user", "type": "address"}
        ],
        "name": "canClaimGM",
        "outputs": [
            {"internalType": "bool", "name": "", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "fromToken", "type": "address"},
            {"internalType": "address", "name": "toToken", "type": "address"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
        ],
        "name": "calculateSwap",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimGM",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "EURC",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "user", "type": "address"}
        ],
        "name": "getGMCooldown",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "lastGMClaim",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_swapFee", "type": "uint256"}
        ],
        "name": "setSwapFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "fromToken", "type": "address"},
            {"internalType": "address", "name": "toToken", "type": "address"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
        ],
        "name": "swap",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "swapFee",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "USDC",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "withdrawEURC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const CUSTOM_USDC_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Burn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Mint",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stableSwap",
                "type": "address"
            }
        ],
        "name": "setStableSwapContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stableSwapContract",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const EURC_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_stableSwap",
				"type": "address"
			}
		],
		"name": "setStableSwapContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stableSwapContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// === ELEMENTS ===
const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const usdcBalance = document.getElementById('usdcBalance');
const eurcBalance = document.getElementById('eurcBalance');
const amountIn = document.getElementById('amountIn');
const amountOut = document.getElementById('amountOut');
const fromToken = document.getElementById('fromToken');
const toToken = document.getElementById('toToken');
const swapBtn = document.getElementById('swapBtn');
const gmBtn = document.getElementById('gmBtn');
const gmTimer = document.getElementById('gmTimer');

let web3, userAddress, stableSwapContract, usdcContract, eurcContract;

// === TOAST ===
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), duration);
}
document.getElementById('toastClose').onclick = () => document.getElementById('toast').classList.add('hidden');

// === CONNECT WALLET ===
async function connectWallet() {
    if (!window.ethereum) return alert('Install MetaMask!');
    web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    await switchToArcTestnet();
    userAddress = accounts[0];

    stableSwapContract = new web3.eth.Contract(STABLE_SWAP_ABI, CONFIG.STABLE_SWAP_CONTRACT);
    usdcContract = new web3.eth.Contract(CUSTOM_USDC_ABI, CONFIG.USDC);
    eurcContract = new web3.eth.Contract(EURC_ABI, CONFIG.EURC);

    updateWalletUI();
    updateBalances();
    updateGMButton();
}

// === DISCONNECT WALLET ===
function disconnectWallet() {
    userAddress = null;
    web3 = null;
    stableSwapContract = null;
    usdcContract = null;
    eurcContract = null;

    connectWalletBtn.style.display = 'block';
    walletInfo.classList.add('hidden');

    amountIn.value = '';
    amountOut.value = '';
    swapBtn.disabled = true;
    swapBtn.textContent = 'Enter Amount';
    usdcBalance.textContent = '0.0';
    eurcBalance.textContent = '0.0';
    gmTimer.classList.add('hidden');

    showToast('Wallet disconnected!');
}

// === SWITCH CHAIN ===
async function switchToArcTestnet() {
    try {
        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x4CEF52' }] });
    } catch (e) {
        if (e.code === 4902) {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x4CEF52',
                    chainName: 'Arc Testnet',
                    rpcUrls: [CONFIG.RPC_URL],
                    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                    blockExplorerUrls: ['https://testnet.arcscan.app']
                }]
            });
        }
    }
}

// === UPDATE UI ===
function updateWalletUI() {
    walletAddress.textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
    connectWalletBtn.style.display = 'none';
    walletInfo.classList.remove('hidden');
}

async function updateBalances() {
    if (!userAddress) return;
    const usdc = await usdcContract.methods.balanceOf(userAddress).call();
    const eurc = await eurcContract.methods.balanceOf(userAddress).call();
    usdcBalance.textContent = (usdc / 1e6).toFixed(6);
    eurcBalance.textContent = (eurc / 1e6).toFixed(6);
}

// === CALCULATE OUTPUT ===
async function calculateOutput() {
    const val = amountIn.value;
    if (!val || !stableSwapContract) {
        amountOut.value = ''; swapBtn.disabled = true; return;
    }
    const wei = web3.utils.toWei(val, 'mwei');
    const out = await stableSwapContract.methods.calculateSwap(fromToken.value, toToken.value, wei).call();
    amountOut.value = parseFloat(web3.utils.fromWei(out, 'mwei')).toFixed(6);
    swapBtn.disabled = false;
    swapBtn.textContent = 'Swap';
}

// === EXECUTE SWAP ===
async function executeSwap() {
    swapBtn.disabled = true;
    swapBtn.textContent = 'Swapping...';
    const wei = web3.utils.toWei(amountIn.value, 'mwei');

    if (fromToken.value === CONFIG.USDC) {
        const allow = await usdcContract.methods.allowance(userAddress, CONFIG.STABLE_SWAP_CONTRACT).call();
        if (BigInt(allow) < BigInt(wei)) {
            await usdcContract.methods.approve(CONFIG.STABLE_SWAP_CONTRACT, wei).send({ from: userAddress });
        }
    } else {
        const allow = await eurcContract.methods.allowance(userAddress, CONFIG.STABLE_SWAP_CONTRACT).call();
        if (BigInt(allow) < BigInt(wei)) {
            await eurcContract.methods.approve(CONFIG.STABLE_SWAP_CONTRACT, wei).send({ from: userAddress });
        }
    }

    await stableSwapContract.methods.swap(fromToken.value, toToken.value, wei).send({ from: userAddress });
    showToast('Swap successful!');
    updateBalances();
    amountIn.value = ''; amountOut.value = '';
    swapBtn.textContent = 'Enter Amount';
    swapBtn.disabled = true;
}

// === ADD TOKEN TO METAMASK ===
async function addTokenToMetaMask(tokenName, tokenAddress) {
    if (!window.ethereum) return showToast('MetaMask not detected!');
    try {
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenName,
                    decimals: 6,
                    image: tokenName === 'USDC' 
                        ? 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
                        : 'https://cryptologos.cc/logos/euro-coin-euroc-logo.png',
                },
            },
        });
        showToast(wasAdded ? `${tokenName} added!` : `${tokenName} not added.`);
    } catch (e) { showToast('Failed to add token.'); }
}

// === GM BUTTON ===
async function updateGMButton() {
    if (!userAddress) return;
    const can = await stableSwapContract.methods.canClaimGM(userAddress).call();
    gmBtn.disabled = !can;
    gmBtn.textContent = can ? 'GM ARC' : 'GM ARC (24h cooldown)';
}

gmBtn.onclick = async () => {
    gmBtn.disabled = true;
    gmBtn.textContent = 'Claiming...';
    await stableSwapContract.methods.claimGM().send({ from: userAddress });
    showToast('GM claimed!');
    updateGMButton();
};

// === EVENT LISTENERS ===
connectWalletBtn.onclick = connectWallet;
document.getElementById('disconnectWallet').onclick = disconnectWallet;
document.getElementById('addUSDC').onclick = () => addTokenToMetaMask('USDC', CONFIG.USDC);
document.getElementById('addEURC').onclick = () => addTokenToMetaMask('EURC', CONFIG.EURC);
amountIn.oninput = calculateOutput;
fromToken.onchange = toToken.onchange = () => {
    if (fromToken.value === toToken.value) {
        toToken.value = fromToken.value === CONFIG.USDC ? CONFIG.EURC : CONFIG.USDC;
    }
    calculateOutput();
};
document.getElementById('swapTokens').onclick = () => {
    [fromToken.value, toToken.value] = [toToken.value, fromToken.value];
    calculateOutput();
};
swapBtn.onclick = executeSwap;

// === INIT ===
if (typeof Web3 === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.10.0/web3.min.js';
    s.onload = () => {};
    document.head.appendChild(s);
}