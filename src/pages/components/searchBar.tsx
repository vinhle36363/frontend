import React from "react";
import { Input, Tooltip } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { Button } from "antd";

const SearchBar: React.FC = () => (
  <div style={{ display: "flex" }}>
    <Input placeholder="Searching..." id="search"/>
    <Tooltip title="search">
      <Button type="dashed" icon={<SearchOutlined />} />
    </Tooltip>
  </div>
);

export default SearchBar;
