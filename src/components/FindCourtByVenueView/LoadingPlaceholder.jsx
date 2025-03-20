const LoadingPlaceholder = () => {
    return (
        <div className="flex justify-center items-center p-6">
            <p className="text-indigo-500 text-lg font-semibold animate-pulse">
                Loading courts...
            </p>
        </div>
    );
};

export default LoadingPlaceholder;