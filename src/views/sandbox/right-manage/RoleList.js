import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState(0)
    const [isModalVisible, setisModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName'
        },
        {
            title: "Operation",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        setisModalVisible(true)
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }} />
                </div>
            }
        }
    ]

    const confirmMethod = (item) => {
        confirm({
            title: 'Are you sure to delete it?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });
    }

    const deleteMethod = (item) => {
        // console.log(item)
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }

    useEffect(() => {
        axios.get("/roles").then(res => {
            // console.log(res.data)
            setdataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            // console.log(res.data)
            setRightList(res.data)
        })
    }, [])

    const handleOk = () => {
        console.log(currentRights, currentId)
        setisModalVisible(false)
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        //patch

        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }

    const handleCancel = () => {
        setisModalVisible(false)
    }

    const onCheck = (checkKeys) => {
        // console.log(checkKeys)
        setcurrentRights(checkKeys.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}></Table>

            <Modal title="Right Assignment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
