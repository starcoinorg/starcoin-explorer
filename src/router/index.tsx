import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';


const TokensTransactionList = lazy(() => import('../modules/Tokens/components/TransactionList/adapter'));
const TokensHolderList = lazy(() => import('../modules/Tokens/components/HolderList/adapter'));
const TokensDetail = lazy(() => import('../modules/Tokens/components/Detail/adapter'));
const TokensList = lazy(() => import('../modules/Tokens/components/List/adapter'));
const Home = lazy(() => import('../modules/Home/adapter'));
const Search = lazy(() => import('../modules/Search/adapter'));
const BlockDetail = lazy(() => import('../modules/Blocks/components/Detail/adapter'));
const BlockList = lazy(() => import('../modules/Blocks/components/List/adapter'));
const UncleBlockDetail = lazy(() => import('../modules/UncleBlocks/components/Detail/adapter'));
const UncleBlockList = lazy(() => import('../modules/UncleBlocks/components/List/adapter'));
const TransactionsDetail = lazy(() => import('../modules/Transactions/components/Detail/adapter'));
const TransactionsList = lazy(() => import('../modules/Transactions/components/List/adapter'));
const PendingTransactionsDetail = lazy(() => import('../modules/PendingTransactions/components/Detail/adapter'));
const PendingTransactionsList = lazy(() => import('../modules/PendingTransactions/components/List/adapter'));
const AddressTransactions = lazy(() => import('../modules/AddressTransactions/components/List/adapter'));
const NetworkRedirect = lazy(() => import('../modules/NetworkRedirect/index'));
const Ecosystems = lazy(() => import('../modules/Ecosystems'));
const Faq = lazy(() => import('../modules/Faq'));
const Tools = lazy(() => import('../modules/Tools'));
const Terms = lazy(() => import('../modules/Terms'));
const Address = lazy(() => import('../modules/Address/adapter'));
const Error404 = lazy(() => import('../modules/Error404'));

export default function AppRouter() {
  return <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/search/:keyword' element={<Search />} />

    <Route path='/:network/blocks'>
      <Route path='height/:height/:tab' element={<BlockDetail />} />
      <Route path='height/:height' element={<BlockDetail />} />
      <Route path='detail/:hash/:tab' element={<BlockDetail />} />
      <Route path='detail/:hash' element={<BlockDetail />} />
      <Route path=':page' element={<BlockList />} />
    </Route>


    <Route path='/:network/uncleblocks'>
      <Route path='height/:height/:author' element={<UncleBlockDetail />} />
      <Route path='hash/:hash' element={<UncleBlockDetail />} />
      <Route path=':page' element={<UncleBlockList />} />
    </Route>


    <Route path='/:network/transactions'>
      <Route path='detail/:hash/:tab' element={<TransactionsDetail />} />
      <Route path='detail/:hash' element={<TransactionsDetail />} />
      <Route path=':page' element={<TransactionsList />} />
    </Route>


    <Route path='/:network/pending_transactions'>
      <Route path='detail/:hash/:tab' element={<PendingTransactionsDetail />} />
      <Route path='detail/:hash' element={<PendingTransactionsDetail />} />
      <Route path=':page' element={<PendingTransactionsList />} />
    </Route>


    <Route path='/:network/tokens'>
      <Route path='transactions/:token_type_tag/:page' element={<TokensTransactionList />} />
      <Route path='holders/:token_type_tag/:page' element={<TokensHolderList />} />
      <Route path='detail/:token_type_tag' element={<TokensDetail />} />
      <Route path=':page' element={<TokensList />} />
    </Route>

    <Route path='/main' element={<NetworkRedirect path='main' />} />
    <Route path='/barnard' element={<NetworkRedirect path='barnard' />} />
    <Route path='/halley' element={<NetworkRedirect path='halley' />} />
    <Route path='/proxima' element={<NetworkRedirect path='proxima' />} />
    <Route path='/ecosystems' element={<Ecosystems />} />
    <Route path='/tools' element={<Tools />} />
    <Route path='/faq' element={<Faq />} />
    <Route path='/terms' element={<Terms />} />
    <Route path='/:network/address/:hash' element={<Address />} />
    <Route path='/:network/address/:hash/:tab' element={<Address />} />
    <Route path='/:network/address_transactions/:hash/:page' element={<AddressTransactions />} />


    <Route path='/error' element={<Error404 />} />
    <Route path='*' element={<Error404 />} />
  </Routes>;
}