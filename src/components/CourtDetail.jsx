"use client"
import sportsData from "../data/sportsData";
import { useNavigate } from "react-router-dom";

const CourtDetail = ({ court, onEdit, onDelete, sportsCenters }) => {
  const { name, description, court_type, facilities, images, status, sports_center_id, sport_id } = court;
  const navigate = useNavigate();

  // Tìm thông tin trung tâm thể thao
  const sportsCenter = sportsCenters.find((center) => center.centerId === sports_center_id);

  // Tìm thông tin môn thể thao (sport_id bây giờ là tên môn thể thao)
  const sport = sportsData.find((sport) => sport.name === sport_id);

  const handlePromotionClick = () => {
    navigate(`/PromotionManagement/${court.courtId}`);
  };

  return (
    <div className="court-detail">
      <div className="court-detail-header">
        <h2>{name}</h2>
        <div className="court-detail-actions">
          <button className="edit-btn" onClick={onEdit}>
            Chỉnh Sửa
          </button>
          <button className="delete-btn" onClick={onDelete}>
            Xóa
          </button>
          <button className="promotion-btn" onClick={handlePromotionClick}>
            Khuyến Mãi
          </button>
        </div>
      </div>

      <div className="court-detail-status">
        <span className={`status-badge ${status}`}>{status === "open" ? "Đang mở" : "Đã đóng"}</span>
        <span className="court-type-badge">{court_type}</span>
      </div>

      <div className="court-detail-info-grid">
        <div className="court-detail-description">
          <h3>Mô tả</h3>
          <p>{description}</p>
        </div>

        <div className="court-detail-center">
          <h3>Trung tâm thể thao</h3>
          <p>{sportsCenter ? sportsCenter.name : "Không xác định"}</p>
          {sportsCenter && <p className="center-address">{sportsCenter.address}</p>}
        </div>

        <div className="court-detail-sport">
          <h3>Môn thể thao</h3>
          <div className="sport-info">
            {sport && sport.icon && (
              <div className="sport-icon">
                <img src={sport.icon || "/placeholder.svg"} alt={sport.name} />
              </div>
            )}
            <p>{sport ? sport.name : "Không xác định"}</p>
          </div>
        </div>
      </div>

      <div className="court-detail-facilities">
        <h3>Tiện ích</h3>
        <ul>
          <li>
            <span className="facility-label">Chiếu sáng:</span>
            <span className="facility-value">{facilities.lighting ? "Có" : "Không"}</span>
          </li>
          <li>
            <span className="facility-label">Phòng thay đồ:</span>
            <span className="facility-value">{facilities.locker_room ? "Có" : "Không"}</span>
          </li>
          <li>
            <span className="facility-label">Bãi đỗ xe:</span>
            <span className="facility-value">
              {facilities.parking === "sufficient"
                ? "Đầy đủ"
                : facilities.parking === "limited"
                  ? "Hạn chế"
                  : facilities.parking === "ample"
                    ? "Rộng rãi"
                    : facilities.parking}
            </span>
          </li>
        </ul>
      </div>

      <div className="court-detail-images">
        <h3>Hình ảnh</h3>
        <div className="court-avatar">
          <h4>Ảnh đại diện</h4>
          <div className="court-avatar-image">
            <img src={images.avatar || "/placeholder.svg?height=200&width=200"} alt={`${name} - Avatar`} />
          </div>
        </div>
        <div className="court-images-gallery">
          <h4>Thư viện ảnh</h4>
          <div className="gallery-grid">
            {images.images.map((img, index) => (
              <div key={index} className="court-image">
                <img src={img || "/placeholder.svg?height=150&width=200"} alt={`${name} - ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;

