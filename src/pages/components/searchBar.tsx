import React from "react";
import { Input, Tooltip,Button } from "antd";

import { SearchOutlined } from "@ant-design/icons";


const SearchBar: React.FC = () => (
  <div style={{ display: "flex", borderRadius: "0", marginTop: "10px" }}>
    <Input placeholder="Searching..." id="search"/>
    <Tooltip title="search">
      <Button type="dashed" icon={<SearchOutlined />} />
    </Tooltip>
  </div>
);

export default SearchBar;
