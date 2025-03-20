"use client"

import { useState } from "react"
import { Button, Modal, Form, Card, Typography, Space, Divider } from "antd"
import { PlusOutlined, DashboardOutlined } from "@ant-design/icons"
import { sportsCentersData } from "../data/sportsCentersData"
import SportsCenterTable from "../components/SportsCenterTable"
import SportsCenterForm from "../components/SportsCenterForm"
import SportsCenterSearch from "../components/SportsCenterSearch"

const { Title } = Typography

const SportsCenter = () => {
    const [sportsCenters, setSportsCenters] = useState(sportsCentersData)
    const [newEntries, setNewEntries] = useState([])
    const [searchText, setSearchText] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingCenter, setEditingCenter] = useState(null)
    const [form] = Form.useForm()

    const handleSearch = (e) => {
        setSearchText(e.target.value)
    }

    const mergedCenters = [...sportsCenters, ...newEntries]

    const filteredCenters = mergedCenters.filter((center) =>
        Object.values(center).some((value) => String(value).toLowerCase().includes(searchText.toLowerCase())),
    )

    const handleEdit = (record) => {
        setEditingCenter(record)
        setIsModalVisible(true)
    }

    const handleDelete = (record) => {
        setSportsCenters(sportsCenters.filter((center) => center !== record))
        setNewEntries(newEntries.filter((center) => center !== record))
    }

    const handleAdd = () => {
        setEditingCenter(null)
        setIsModalVisible(true)
    }

    const handleOk = (values) => {
        if (editingCenter) {
            const updatedCenters = mergedCenters.map((center) => (center === editingCenter ? values : center))
            setSportsCenters(updatedCenters.filter((center) => !newEntries.includes(center)))
            setNewEntries(updatedCenters.filter((center) => newEntries.includes(center)))
        } else {
            setNewEntries([...newEntries, values])
        }
        setIsModalVisible(false)
        form.resetFields()
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
    }

    return (
        <div className="sports-center-container" style={{ width: "100%" }}>
            <SportsCenterSearch searchText={searchText} handleSearch={handleSearch} />

            <div className="content-container" style={{ padding: "24px", width: "100%" }}>
                <Card
                    className="dashboard-card"
                    style={{
                        marginBottom: "24px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        borderRadius: "8px",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <Space>
                            <DashboardOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                            <Title level={4} style={{ margin: 0 }}>
                                Sports Centers Management
                            </Title>
                        </Space>
                        <Button
                            type="primary"
                            onClick={handleAdd}
                            icon={<PlusOutlined />}
                            size="large"
                            style={{
                                borderRadius: "6px",
                                background: "#1890ff",
                                boxShadow: "0 2px 6px rgba(24, 144, 255, 0.3)",
                            }}
                        >
                            Add Sports Center
                        </Button>
                    </div>

                    <Divider style={{ margin: "12px 0 20px" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div>
                            <Title level={5} style={{ margin: 0 }}>
                                Total Centers: {filteredCenters.length}
                            </Title>
                            {searchText && <p style={{ color: "#8c8c8c", margin: "4px 0 0" }}>Showing results for: "{searchText}"</p>}
                        </div>
                    </div>

                    <SportsCenterTable data={filteredCenters} onEdit={handleEdit} onDelete={handleDelete} />
                </Card>
            </div>

            <Modal
                title={editingCenter ? "Edit Sports Center" : "Add Sports Center"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                destroyOnClose={true}
                style={{ top: 20 }}
                bodyStyle={{ padding: "24px" }}
            >
                <SportsCenterForm initialValues={editingCenter} onFinish={handleOk} form={form} />
            </Modal>
        </div>
    )
}

export default SportsCenter

