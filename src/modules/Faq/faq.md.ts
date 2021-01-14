const FAQ = `
## Starcoin 是什么?

Starcoin 是一个分层的，去中心化的区块链系统。

## 白皮书有吗？

有。 可以在 Starcoin 官网下载: http://starcoin.org/

## Starcoin 采用什么共识？

Starcoin 一层使用 POW 共识算法。

## 使用什么语言编写合约？

Starcoin 采用和 [diem](https://github.com/diem/diem) 相同的合约语言： [Move](https://github.com/diem/diem/master/language/move-lang) 。
Move 是专门为链上资产所设计的合约语言。合约可以做形式化验证，相比 Solidity，有更高的安全性。

## Starcoin 代币模型是怎么样的？

STC 是 Starcoin 的原生代币，采用和 Bitcoin 类似的代币发放模型：每四年减半。

## Starcoin 有自己的 Token 标准吗，类似 ERC20 ？
有。 Starcoin 内置了 Token 合约，定义了一系列 Token 标准。 开发者可以基于该合约开发自己的 Token。

## Starcoin 支持去中心化治理吗？

支持。 Starcoin 内置了 DAO 合约，可用来对链本身的参数做去中心化的治理。
同时开发者自定义的 Token 也可以接入该 DAO 标准，从而实现 Token 的 DAO 功能。

## Starcoin 支持多签账户吗？

支持。
`;


export default FAQ;