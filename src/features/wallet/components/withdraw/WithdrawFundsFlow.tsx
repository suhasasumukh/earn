import { zodResolver } from '@hookform/resolvers/zod';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { useUser } from '@/store/user';

import { type TokenAsset } from '../../types/TokenAsset';
import { type TxData } from '../../types/TxData';
import { createTransferInstructions } from '../../utils/createTransferInstructions';
import {
  type WithdrawFormData,
  withdrawFormSchema,
} from '../../utils/withdrawFormSchema';
import { type DrawerView } from '../WalletDrawer';
import { TransactionDetails } from './TransactionDetails';
import { WithdrawForm } from './WithdrawForm';

interface WithdrawFlowProps {
  tokens: TokenAsset[];
  view: DrawerView;
  setView: (view: DrawerView) => void;
  txData: TxData;
  setTxData: (txData: TxData) => void;
}

export function WithdrawFundsFlow({
  tokens,
  view,
  setView,
  txData,
  setTxData,
}: WithdrawFlowProps) {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      tokenAddress: tokens[0]?.tokenAddress ?? '',
      amount: '',
      address: '',
    },
  });

  const queryClient = useQueryClient();

  const selectedToken = tokens.find(
    (token) => token.tokenAddress === form.watch('tokenAddress'),
  );

  const { wallets } = useSolanaWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  );

  async function handleWithdraw(values: WithdrawFormData) {
    setIsProcessing(true);
    setError('');
    try {
      const connection = new Connection(
        `https://${process.env.NEXT_PUBLIC_RPC_URL}`,
      );

      const { blockhash } = await connection.getLatestBlockhash('finalized');

      const instructions = await createTransferInstructions(
        connection,
        values,
        user?.walletAddress as string,
        selectedToken,
      );

      const message = new TransactionMessage({
        payerKey: new PublicKey(process.env.NEXT_PUBLIC_FEEPAYER as string),
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      const serializedMessage = Buffer.from(
        transaction.message.serialize(),
      ).toString('base64');

      const provider = await embeddedWallet?.getProvider();
      const { signature: serializedUserSignature } = await provider?.request({
        method: 'signMessage',
        params: { message: serializedMessage },
      });

      const userSignature = Buffer.from(serializedUserSignature, 'base64');
      transaction.addSignature(
        new PublicKey(user?.walletAddress as string),
        userSignature,
      );

      const serializedTransaction = Buffer.from(
        transaction.serialize(),
      ).toString('base64');

      const response = await api.post('/api/wallet/sign-transaction', {
        serializedTransaction,
      });

      const signedTransaction = VersionedTransaction.deserialize(
        Buffer.from(response.data.serializedTransaction, 'base64'),
      );

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      const confirmation = await connection.confirmTransaction(
        signature,
        'confirmed',
      );

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      const status = await connection.getSignatureStatus(signature);
      if (status.value?.err) {
        throw new Error('Transaction failed after confirmation');
      }

      setTxData({
        signature,
        ...values,
        timestamp: Date.now(),
        type: 'Withdrawn',
      });
      await queryClient.invalidateQueries({
        queryKey: ['wallet', 'assets', 'activity'],
      });
      setView('success');

      return signature;
    } catch (e) {
      console.error('Withdrawal failed:', e);
      setError(
        e instanceof Error
          ? e.message
          : 'Transaction failed. Please try again.',
      );
      console.log(error);
      setView('withdraw');
      toast.error('Transaction failed. Please try again.');
      return Promise.reject(new Error('Transaction failed'));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      {view === 'withdraw' && (
        <WithdrawForm
          form={form}
          selectedToken={selectedToken}
          onSubmit={handleWithdraw}
          tokens={tokens}
          isProcessing={isProcessing}
        />
      )}

      {view === 'success' && <TransactionDetails txData={txData} />}
      {view === 'history' && <TransactionDetails txData={txData} />}
    </div>
  );
}
