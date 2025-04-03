import React, { useState } from "react";
import { Pagination } from "antd";
import CourtCard from "@/components/FindCourtByVenueView/CourtCard";
import LoadingPlaceholder from "@/components/FindCourtByVenueView/LoadingPlaceholder";

const CourtList = ({ courts, loading  }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const paginatedCourts = courts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="mt-6">
            {loading ? (
                <LoadingPlaceholder />
            ) : courts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {courts
                            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                            .map((court) => (
                                <CourtCard key={court.court_id} court={court} />
                            ))}
                    </div>
                    {courts.length > pageSize && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={courts.length}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                                className="text-gray-600"
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center items-center p-6">
                    <p className="text-gray-500 text-lg">Không có sân phù hợp tại trung tâm thể thao này.</p>
                </div>
            )}
        </div>
    );
};

export default CourtList;