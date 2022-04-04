import { useMemo } from "react";
import { Card, List, Button } from "antd";
import { StopOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const FollowList = ({ header, data }) => {
  const style = useMemo(
    () => ({
      marginBottom: "20px",
      border: "1px solid #d9d9d9",
      padding: "20px",
    }),
    []
  );

  const listStyle = useMemo(
    () => ({
      marginBottom: "20px",
    }),
    []
  );
  const gridStyle = useMemo(
    () => ({
      gutter: "4",
      xs: "2",
      md: "3",
    }),
    []
  );
  const loadStyle = useMemo(
    () => ({
      textAlign: "center",
      margin: "10px 0",
    }),
    []
  );
  return (
    <List
      style={listStyle}
      grid={gridStyle}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div stlye={loadStyle}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card actions={[<StopOutlined key="stop" />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
