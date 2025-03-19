import TransactionCard from "./TransactionCard"

const TransactionList = ({ transactions, type, title }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
        <p className="text-gray-500 text-center py-8">Không có giao dịch nào</p>
      </div>
    )
  }

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        {title}
        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">{transactions.length}</span>
      </h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} type={type} />
        ))}
      </div>
    </div>
  )
}

export default TransactionList

