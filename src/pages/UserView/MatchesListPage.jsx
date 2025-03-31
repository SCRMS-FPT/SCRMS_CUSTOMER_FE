import React, { useState, useEffect } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    CircularProgress,
    Divider,
    Button,
    Pagination,
    Modal, Checkbox
} from "@mui/material";
import { Close, Check } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

// Component TabPanel hiển thị nội dung theo tab (nếu cần)
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`matches-tabpanel-${index}`}
            aria-labelledby={`matches-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}

// Detail component cho Pending Requests
function PendingDetail({
    matchItem,
    handleCancelLike,
    showAcceptModal,
    setShowAcceptModal,
    showRejectModal,
    setShowRejectModal,
    setPendingMatches, // Nhận setPendingMatches từ props
}) {
    return matchItem ? (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardHeader
                avatar={<Avatar src={matchItem.avatar} alt={matchItem.full_name} />}
                title={matchItem.full_name}
                subheader={`Skill: ${matchItem.skill_level ? matchItem.skill_level.toUpperCase() : "N/A"}`}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Yêu cầu ghép đang chờ phản hồi.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    {/* Nút Đồng Ý */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setShowAcceptModal(true); // Hiển thị modal đồng ý
                        }}
                    >
                        Đồng ý
                    </Button>

                    {/* Nút Từ Chối */}
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setShowRejectModal(true); // Hiển thị modal từ chối
                        }}
                    >
                        Từ chối
                    </Button>
                </Box>
            </CardContent>

            {/* Modal Đồng Ý */}
            <Modal
                open={showAcceptModal}
                onClose={() => setShowAcceptModal(false)}
                aria-labelledby="accept-modal-title"
                aria-describedby="accept-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="accept-modal-title" variant="h6" component="h2">
                        Bạn có chắc chắn muốn đồng ý yêu cầu ghép trận này?
                    </Typography>
                    <Typography id="accept-modal-description" sx={{ mt: 2 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setShowAcceptModal(false)} sx={{ mr: 2 }}>
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                console.log("Đồng ý yêu cầu:", matchItem);
                                setPendingMatches((prev) =>
                                    prev.filter((match) => match.swipe_id !== matchItem.swipe_id)
                                );
                                setShowAcceptModal(false); // Đóng modal
                            }}
                        >
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal Từ Chối */}
            <Modal
                open={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                aria-labelledby="reject-modal-title"
                aria-describedby="reject-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="reject-modal-title" variant="h6" component="h2">
                        Bạn có chắc chắn muốn từ chối yêu cầu ghép trận này?
                    </Typography>
                    <Typography id="reject-modal-description" sx={{ mt: 2 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setShowRejectModal(false)} sx={{ mr: 2 }}>
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                console.log("Từ chối yêu cầu:", matchItem);
                                setPendingMatches((prev) =>
                                    prev.filter((match) => match.swipe_id !== matchItem.swipe_id)
                                );
                                setShowRejectModal(false); // Đóng modal
                            }}
                        >
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    ) : (
        <Typography align="center">Chọn một yêu cầu để xem chi tiết.</Typography>
    );
}


// Detail component cho Confirmed Matches
function ConfirmedDetail({ matchItem }) {
    return matchItem && matchItem.matched_user_id ? (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardHeader
                avatar={
                    <Avatar>
                        {matchItem.matched_user_id?.charAt(0).toUpperCase() || ""}
                    </Avatar>
                }
                title={`Match với ${matchItem.matched_user_id}`}
                subheader={new Date(matchItem.match_time).toLocaleString()}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Trạng thái: {matchItem.status}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Chat ngay
                </Button>
            </CardContent>
        </Card>
    ) : (
        <Typography align="center">Chọn một match để xem chi tiết.</Typography>
    );
}

// Detail component cho Liked Matches
function LikedDetail({
    matchItem,
    handleCancelLike,
    confirmCancel, // Nhận prop confirmCancel
    showConfirmModal,
    setShowConfirmModal,
    skipConfirmation,
    setSkipConfirmation,
}) {
    return matchItem ? (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardHeader
                avatar={<Avatar src={matchItem.avatar} alt={matchItem.full_name} />}
                title={matchItem.full_name}
                subheader={`Skill: ${matchItem.skill_level ? matchItem.skill_level.toUpperCase() : "N/A"}`}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Môn: {matchItem.sport_id}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Đây là trận đấu bạn đã thích.
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => handleCancelLike(matchItem)}
                >
                    Hủy yêu cầu
                </Button>
            </CardContent>

            {/* Modal Xác Nhận */}
            <Modal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Bạn có chắc chắn muốn hủy trận đấu này?
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <Checkbox
                            checked={skipConfirmation}
                            onChange={(e) => setSkipConfirmation(e.target.checked)}
                        />
                        <Typography variant="body2">Không hỏi lại lần tới</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setShowConfirmModal(false)} sx={{ mr: 2 }}>
                            Hủy
                        </Button>
                        <Button variant="contained" color="error" onClick={confirmCancel}>
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    ) : (
        <Typography align="center">Chọn một trận đấu để xem chi tiết.</Typography>
    );
}


export default function MatchesListPage({ likedMatchesFromSwipe = [] }) {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const initialTab = parseInt(query.get("tab") || "0", 10);

    const [tabValue, setTabValue] = useState(initialTab);
    const [pendingMatches, setPendingMatches] = useState([]);
    const [confirmedMatches, setConfirmedMatches] = useState([]);
    const [likedMatches, setLikedMatches] = useState(likedMatchesFromSwipe);

    const [loadingPending, setLoadingPending] = useState(true);
    const [loadingConfirmed, setLoadingConfirmed] = useState(true);
    const [loadingLiked, setLoadingLiked] = useState(true);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [skipConfirmation, setSkipConfirmation] = useState(false);
    const [modalAction, setModalAction] = useState(""); // State để lưu hành động của modal
    const [showAcceptModal, setShowAcceptModal] = useState(false); // Modal đồng ý
    const [showRejectModal, setShowRejectModal] = useState(false); // Modal từ chối

    // State để lưu mục được chọn cho chi tiết của tab hiện hành
    const [selectedItem, setSelectedItem] = useState(null);

    // Cập nhật URL khi tab thay đổi
    useEffect(() => {
        navigate(`?tab=${tabValue}`, { replace: true });
        // Reset selected item khi tab thay đổi
        setSelectedItem(null);
    }, [tabValue, navigate]);

    // Giả lập API cho Pending Requests
    useEffect(() => {
        setTimeout(() => {
            const mockPending = [
                {
                    swipe_id: "uuid-swipe-001",
                    swiped_user_id: "uuid-user-002",
                    full_name: "Trần Thị B",
                    avatar: "https://example.com/avatar2.jpg",
                    skill_level: "advanced",
                },
                {
                    swipe_id: "uuid-swipe-002",
                    swiped_user_id: "uuid-user-004",
                    full_name: "Phạm Văn D",
                    avatar: "https://example.com/avatar4.jpg",
                    skill_level: "intermediate",
                },
            ];
            setPendingMatches(mockPending);
            setLoadingPending(false);
        }, 1500);
    }, []);

    // Giả lập API cho Confirmed Matches
    useEffect(() => {
        setTimeout(() => {
            const mockConfirmed = [
                {
                    initiator_id: "uuid-user-001",
                    matched_user_id: "uuid-user-002",
                    match_time: "2025-05-10T12:30:00Z",
                    status: "confirmed",
                },
                {
                    initiator_id: "uuid-user-005",
                    matched_user_id: "uuid-user-006",
                    match_time: "2025-05-11T14:00:00Z",
                    status: "confirmed",
                },
            ];
            setConfirmedMatches(mockConfirmed);
            setLoadingConfirmed(false);
        }, 1500);
    }, []);

    // Giả lập API cho Liked Matches nếu chưa truyền dữ liệu từ bước swipe
    useEffect(() => {
        setTimeout(() => {
            if (likedMatchesFromSwipe.length === 0) {
                const mockLiked = [
                    {
                        user_id: "uuid-user-003",
                        full_name: "Lê Thị C",
                        avatar: "https://example.com/avatar3.jpg",
                        skill_level: "intermediate",
                        sport_id: "uuid-sport-002",
                    },
                    {
                        user_id: "uuid-user-007",
                        full_name: "Nguyễn Văn E",
                        avatar: "https://example.com/avatar5.jpg",
                        skill_level: "advanced",
                        sport_id: "uuid-sport-003",
                    },
                ];
                setLikedMatches(mockLiked);
            }
            setLoadingLiked(false);
        }, 1500);
    }, [likedMatchesFromSwipe]);

    // Khi người dùng bấm chọn 1 card trong danh sách (left column)
    const handleSelectItem = (item) => {
        setSelectedItem(item);
    };

    const confirmCancel = () => {
        if (modalAction === "accept") {
            console.log("Đồng ý yêu cầu:", selectedItem);
            setPendingMatches((prev) => prev.filter((match) => match.swipe_id !== selectedItem.swipe_id));
        } else if (modalAction === "reject") {
            console.log("Từ chối yêu cầu:", selectedItem);
            setPendingMatches((prev) => prev.filter((match) => match.swipe_id !== selectedItem.swipe_id));
        } else if (modalAction === "cancelLike") {
            console.log("Hủy trận đấu đã thích:", selectedItem);
            setLikedMatches((prev) => prev.filter((match) => match.user_id !== selectedItem.user_id));
        }
        setShowConfirmModal(false); // Đóng modal
    };

    const handleAcceptRequest = (item) => {
        if (skipConfirmation) {
            console.log("Đồng ý yêu cầu:", item);
            setPendingMatches((prev) => prev.filter((match) => match.swipe_id !== item.swipe_id));
            return;
        }
        setSelectedItem(item); // Cập nhật mục được chọn
        setShowAcceptModal(true); // Hiển thị modal xác nhận
        setModalAction("accept"); // Đặt hành động là "đồng ý"
    };

    const handleRejectRequest = (item) => {
        if (skipConfirmation) {
            console.log("Từ chối yêu cầu:", item);
            setPendingMatches((prev) => prev.filter((match) => match.swipe_id !== item.swipe_id));
            return;
        }
        setSelectedItem(item); // Cập nhật mục được chọn
        setShowRejectModal(true); // Hiển thị modal xác nhận
        setModalAction("reject"); // Đặt hành động là "từ chối"
    };

    const handleCancelLike = (item) => {
        if (skipConfirmation) {
            console.log("Hủy trực tiếp:", item);
            setLikedMatches((prev) => prev.filter((match) => match.user_id !== item.user_id));
            return;
        }
        setSelectedItem(item); // Cập nhật mục được chọn
        setShowConfirmModal(true); // Hiển thị modal xác nhận
        setModalAction("cancelLike"); // Đặt hành động là "hủy thích"
    };

    // Render danh sách card theo tab hiện hành
    const renderList = () => {
        const itemsPerPage = 5; // Số lượng thẻ tối đa trên mỗi trang
        const [currentPage, setCurrentPage] = useState(1); // State để lưu trang hiện tại


        let data = [];
        if (tabValue === 0) {
            data = pendingMatches;
        } else if (tabValue === 1) {
            data = confirmedMatches;
        } else if (tabValue === 2) {
            data = likedMatches;
        }

        const loading = tabValue === 0 ? loadingPending : tabValue === 1 ? loadingConfirmed : loadingLiked;

        if (loading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (data.length === 0) {
            return (
                <Typography align="center">
                    {tabValue === 0
                        ? "Không có yêu cầu ghép nào."
                        : tabValue === 1
                            ? "Bạn chưa có match nào."
                            : "Bạn chưa thích trận nào."}
                </Typography>
            );
        }

        // Tính toán dữ liệu hiển thị cho trang hiện tại
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        return (
            <Box sx={{ overflowY: "auto", maxHeight: "80vh", pr: 1 }}>
                {paginatedData.map((item) => {
                    const itemId =
                        tabValue === 0
                            ? item.swipe_id
                            : tabValue === 1
                                ? item.matched_user_id
                                : item.user_id;

                    const isSelected =
                        selectedItem &&
                        (tabValue === 0
                            ? selectedItem.swipe_id === item.swipe_id
                            : tabValue === 1
                                ? selectedItem.matched_user_id === item.matched_user_id
                                : selectedItem.user_id === item.user_id);

                    return (
                        <Box
                            key={itemId}
                            sx={{
                                mb: 2,
                                cursor: "pointer",
                                transition: "all 0.3s",
                                borderRadius: 2,
                                boxShadow: isSelected ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                                "&:hover": {
                                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                                    transform: "translateY(-2px)",
                                },
                                position: "relative",
                            }}
                            onClick={() => handleSelectItem(item)} // Cập nhật selectedItem
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    backgroundColor: isSelected ? "#e3f2fd" : "white",
                                }}
                            >
                                <Avatar
                                    src={item.avatar}
                                    alt={item.full_name}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        mr: 2,
                                        border: "2px solid #1976d2",
                                    }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {item.full_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {tabValue === 0
                                            ? `Skill: ${item.skill_level.toUpperCase()}`
                                            : tabValue === 1
                                                ? `Match at ${new Date(item.match_time).toLocaleString()}`
                                                : `Skill: ${item.skill_level.toUpperCase()}`}
                                    </Typography>
                                </Box>
                            </Card>

                            {/* Icon dấu "X" */}
                            {tabValue === 0 && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        right: 30,
                                        transform: "translate(50%, -50%)",
                                        width: 40,
                                        height: 40,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        backgroundColor: "#fff",
                                        borderRadius: "50%",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                        zIndex: 10,
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelLike(item);
                                    }}
                                >
                                    <Close sx={{ fontSize: 40, color: "#d32f2f" }} />
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <>
                                    {/* Nút Đồng Ý */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 70,
                                            transform: "translateY(-50%)",
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                            zIndex: 10,
                                            marginRight: 1,
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAcceptRequest(item); // Gọi hàm đồng ý
                                        }}
                                    >
                                        <Check sx={{ fontSize: 20, color: "green" }} />
                                    </Box>

                                    {/* Nút Từ Chối */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 30,
                                            transform: "translateY(-50%)",
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                            zIndex: 10,
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectRequest(item); // Gọi hàm từ chối
                                        }}
                                    >
                                        <Close sx={{ fontSize: 20, color: "#d32f2f" }} />
                                    </Box>
                                </>
                            )}
                        </Box>
                    );
                })}

                {/* Phân trang */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={Math.ceil(data.length / itemsPerPage)} // Tổng số trang
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)} // Cập nhật trang hiện tại
                        color="primary"
                    />
                </Box>
            </Box>
        );
    };

    // Render chi tiết dựa vào tab hiện hành
    const renderDetail = () => {
        if (tabValue === 0) {
            return (
                <LikedDetail
                    matchItem={selectedItem}
                    handleCancelLike={handleCancelLike}
                    confirmCancel={confirmCancel}
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    skipConfirmation={skipConfirmation}
                    setSkipConfirmation={setSkipConfirmation}
                />
            );
        } else if (tabValue === 1) {
            return (
                <PendingDetail
                    matchItem={selectedItem}
                    handleCancelLike={handleCancelLike}
                    showAcceptModal={showAcceptModal}
                    setShowAcceptModal={setShowAcceptModal}
                    showRejectModal={showRejectModal}
                    setShowRejectModal={setShowRejectModal}
                    setPendingMatches={setPendingMatches} // Truyền setPendingMatches
                />
            );
        } else if (tabValue === 2) {
            return <ConfirmedDetail matchItem={selectedItem} />;
        }
    };


    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Danh Sách Trận Đã Ghép
            </Typography>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
                <Tab label="Trận Đấu Đã Thích" id="matches-tab-0" />
                <Tab label="Yêu Cầu Ghép" id="matches-tab-1" />
                <Tab label="Trận đấu của tôi" id="matches-tab-2" />

            </Tabs>

            {/* Layout 2 cột: Left (40%) là danh sách, Right (60%) là chi tiết */}
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
                {/* Cột bên trái với đường kẻ kéo dài */}
                <Box sx={{ display: "flex", flex: "0 0 40%", position: "relative" }}>
                    {/* Đường kẻ kéo dài */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            width: "1px",
                            backgroundColor: "#ddd",
                            height: "70vh", // Kéo dài đường kẻ đến cuối màn hình
                        }}
                    />
                    {/* Nội dung danh sách */}
                    <Box sx={{ flex: 1, pr: 2, overflowY: "auto" }}>{renderList()}</Box>
                </Box>

                {/* Cột bên phải */}
                <Box sx={{ flex: "0 0 60%", pl: 1 }}>
                    {selectedItem ? (
                        renderDetail()
                    ) : (
                        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                            Vui lòng chọn một mục ở bên trái để xem chi tiết.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
