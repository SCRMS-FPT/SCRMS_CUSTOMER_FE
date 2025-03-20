"use client"
import { Input, Typography } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography

const SportsCenterSearch = ({ searchText, handleSearch }) => {
    return (
        <div
            className="hero-section"
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(/src/assets/HLV/sp.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "80px 24px",
                height: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
                position: "relative",
                width: "100%",
            }}
        >
            <div className="hero-content" style={{ width: "100%", maxWidth: "1200px" }}>
                <Title
                    style={{
                        fontSize: "56px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "16px",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    Sports Center Management
                </Title>

                <Paragraph
                    style={{
                        fontSize: "18px",
                        color: "rgba(255, 255, 255, 0.9)",
                        marginBottom: "32px",
                        maxWidth: "800px",
                        margin: "0 auto 32px",
                    }}
                >
                    Find and manage the best sports facilities for your needs. Search through our extensive database of sports
                    centers.
                </Paragraph>

                <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
                    <Input.Search
                        placeholder="Search by name, address, or description..."
                        value={searchText}
                        onChange={handleSearch}
                        size="large"
                        prefix={<SearchOutlined />}
                        enterButton="Search"
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    />
                </div>
            </div>

            <div
                className="hero-overlay"
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "80px",
                    background: "linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                }}
            ></div>
        </div>
    )
}

export default SportsCenterSearch

