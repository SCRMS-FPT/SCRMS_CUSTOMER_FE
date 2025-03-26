import CoachPackageCard from "./coach-package-card"

const CoachPackagesGrid = ({ packages, onEdit, onDelete }) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-slate-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-slate-600 text-lg">Không tìm thấy gói đào tạo phù hợp với tìm kiếm của bạn.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {packages.map((packageData) => (
        <CoachPackageCard key={packageData.id} packageData={packageData} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default CoachPackagesGrid

