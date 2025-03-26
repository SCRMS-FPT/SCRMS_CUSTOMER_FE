const BookingSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="relative">
                <div className="h-3 bg-slate-200"></div>
                <div className="absolute top-3 right-0 transform translate-y-1/2 mr-4">
                    <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                </div>
            </div>

            <div className="p-6 pt-5">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 mr-3"></div>
                    <div>
                        <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                    </div>
                </div>

                <div className="space-y-3 mb-4 bg-slate-100 p-3 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 mr-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-36"></div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 mr-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 mr-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-28"></div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                </div>
            </div>
        </div>
    )
}

export default BookingSkeleton

