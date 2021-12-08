


// const crypto = require('crypto');

// const secret = 'duckar345!';
// const hash = crypto.createHmac('sha256', secret)
//                    .update('I love cupcakes')
//                    .digest('hex');
// console.log(hash);



const privatekey ='52bab34529ab2879073f2494f6d8705a58ffea0e843bf797ce400d8991a05120';// hash;//'0xmnx2u56n8mzk7yuctfbwuu4hkmygb4kk4cephg6z6zqn9wg448wpzackh76zbc';// Private keys are generated as random 256 bits, which is 64 (hex) characters or 32 bytes.


const ethers = require('ethers');
const { TransactionDescription } = require('ethers/lib/utils');
const aavegotchiAddress ='0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7';
const wethAddress ='0x7ceb23fd6bc0add59e62ac25578270cff1b9f619';
//Quickswap Contract Factory  https://polygonscan.com/token/0x831753dd7087cac61ab5644b308642cc1c33dc13#readContract

const pairAddress = '0xccb9d2100037f1253e6c1682adf7dc9944498aff';//https://info.quickswap.exchange/pair/  0xccb9d2100037f1253e6c1682adf7dc9944498aff

const routerAddress = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';//https://polygonscan.com/address/0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff

//const providerUrl = 'wss://apis.ankr.com/wss/3c4a49291148409a940042b78e16de0c/bcc629213d7e12286dee5fc5cc744b46/polygon/full/main';
//const provider = new ethers.providers.WebSocketProvider(providerUrl);

const providerUrl = 'https://apis.ankr.com/3c4a49291148409a940042b78e16de0c/bcc629213d7e12286dee5fc5cc744b46/polygon/full/main';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const wallet = new ethers.Wallet(privatekey);
const signer = wallet.connect(provider);

const pairContract = new ethers.Contract(pairAddress,[

'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'



],signer);

const routerContract = new ethers.Contract(routerAddress,[

'function getAmountsOut(uint amountIn, address[] calldata path)',
'function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path, address to, uint deadline) '


],)
async function Trade(){
    const aaveGAmtIn = ethers.utils.parseUnits('100',18);
    const amounts = await routerContract.GetAmountsOut(aaveGAmtIn,[aavegotchiAddress,wethAddress])
    const wethamountOutMin = ethers.utils.parseUnits(Number((ethers.utils.formatUnits(amounts[1],18)) - .1).toString(),18);
    const tx = await routerContract.swapExactTokensForTokens(
        aaveGAmtIn,wethamountOutMin,[aavegotchiAddress,wethAddress],wallet.address,Date.now()+1000*60*10

    );
    const finished = await tx.wait();
}
pairContract.on('Swap',async(addr,amtIn1,amtIn2,Amtout1,Amtout2,outAddr)=>{
    console.log('Swap happened,considering Trade...');
    const pairData = await pairContract.getReserves();
    const etherReserve = ethers.utils.formatUnits(pairData[0],18);
    const aaveGReserve = ethers.utils.formatUnits(pairData[1],18);
    const conversion = Number(etherReserve) /Number(aaveGReserve);
    console.log(`################################################
    BlockTM:${pairData[2]}
    ETH RESERVE:${etherReserve}
    AAVEGOTCHI PRICE:${conversion}`)

    if(conversion <= 1){

        console.log('We are buying AaveGotchi with Matic');

    }

});
console.log('Listening Waiting for swap...');

