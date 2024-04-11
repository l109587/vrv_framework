import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import { history } from "umi";
import store from "store";
import { language } from "@/utils/language";
import { RightOutlined } from "@ant-design/icons";
import "./index.less";
import { ShuttleFrame } from "@/components";
import DefaultHistory from "../../assets/common/menuicon/defaulthistory.svg";
import DefaultIcon from "../../assets/common/menuicon/defaulticon.svg";
export default (props) => {
  const {
    menuPopoverOpen,
    menuList = [],
    shortcutMenu = [],
    shortRefresh,
    fetchMenuList,
  } = props;
  /* 随机生成应用列表 */
  const [list, setList] = useState([]);
  const occupyArr = [
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
    { type: 2, list: { size: 1, color: "#f4f4f4" }, occupy: "" },
  ];
  const [occupyList, setOccupyList] = useState();

  //自定义列表数据
  const [list2, setList2] = useState([]);
  useEffect(() => {
    getMenuList();
    // 赋值列表
    setList2(getAppList2());
  }, [shortRefresh]);

  useEffect(() => {
    if (!menuPopoverOpen) {
      setPopoverOpen(false);
    }
  }, [menuPopoverOpen]);

  const routeName = (route) => {
    let arr = store.get("Permission") ? store.get("Permission") : [];
    let name = "";
    arr.map((item) => {
      if (item.children) {
        item.children.map((key) => {
          if (key.route == route) {
            name = key.zh.name;
          }
        });
      }
    });
    return name;
  };

  //菜单列表
  const getMenuList = () => {
    let arr = [...occupyArr];
    shortcutMenu?.map((item) => {
      if (item.size == 1) {
        let nowKey = false;
        for (let key = 0; key < arr.length; key++) {
          if (arr[key].type == 2) {
            nowKey = key;
            break;
          }
        }
        if (nowKey !== false) {
          arr[nowKey].type = 1;
          arr[nowKey].list = item;
          arr[nowKey].occupy = item.route;
        }
      } else {
        let nowKey = false;
        for (let key = 0; key < arr.length; key++) {
          if (item.direction == "transverse") {
            if (
              key != 2 &&
              key != 5 &&
              key != 8 &&
              arr[key].type == 2 &&
              arr[key + 1].type == 2
            ) {
              nowKey = key;
              break;
            }
          } else {
            if (
              key != 6 &&
              key != 7 &&
              key != 8 &&
              arr[key].type == 2 &&
              arr[key + 3].type == 2
            ) {
              nowKey = key;
              break;
            }
          }
        }
        if (nowKey !== false) {
          if (item.direction == "transverse") {
            arr[nowKey].type = 1;
            arr[nowKey].list = item;
            arr[nowKey].occupy = item.route;
            arr[nowKey + 1].type = 1;
            arr[nowKey + 1].list = item;
            arr[nowKey + 1].occupy = item.route;
          } else {
            arr[nowKey].type = 1;
            arr[nowKey].list = item;
            arr[nowKey].occupy = item.route;
            arr[nowKey + 3].type = 1;
            arr[nowKey + 3].list = item;
            arr[nowKey + 3].occupy = item.route;
          }
        }
      }
    });

    let mArr = [];
    arr.map((item) => {
      let row = mArr.filter((val) => {
        return val.occupy == item.occupy;
      });
      if (row.length < 1 || !item.occupy) {
        mArr.push(item);
      }
    });
    setOccupyList(arr);
    setList(mArr);
  };

  const getAppList2 = () => {
    let obj = store.get("routerList") ? store.get("routerList") : "";
    let tempArr = [];
    if (obj) {
      let arr = arrSort(obj);
      arr.map((item, index) => {
        if (index < 3) {
          let obj = {};
          obj.size = 1;
          obj.type = 1;
          obj.color = "#298FCC";
          obj.route = item;
          tempArr.push(obj);
        }
      });
    }

    if (tempArr.length < 3) {
      let num = 3 - tempArr.length;
      for (var i = 0; i < num; i++) {
        let obj = {};
        obj.size = 1;
        obj.type = 2;
        obj.color = "#f4f4f4";
        tempArr.push(obj);
      }
    }
    return tempArr;
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  const popoverContent = (
    <ShuttleFrame
      fetchMenuList={fetchMenuList}
      menuList={menuList}
      occupyList={occupyList}
      getMenuList={getMenuList}
      treePopoverOpen={popoverOpen}
      shortcutMenu={shortcutMenu}
    />
  );
  const jHref = (url = "") => {
    if (!popoverOpen) {
      history.push({ pathname: url });
    }
  };

  const arrSort = (MyObj) => {
    // 降序排序value值
    const SortValue = Object.values(MyObj).sort((a, b) => {
      return b - a;
    });
    // 创建结果数组
    const res = {};
    // keys数组
    const keys = Object.keys(MyObj);
    // 给value值赋值相应keys值
    for (var i in SortValue) {
      keys.forEach((item) => {
        if (SortValue[i] === MyObj[item]) {
          res[item] = SortValue[i];
        }
      });
    }
    return Object.keys(res);
  };

  const imgCommonShow = (imageName, type) => {
    let imageSrc = null;
    try {
      imageSrc = require(`../../assets/common/menuicon/${imageName}.svg`);
    } catch (error) {
      console.log(`Image ${imageName} not found`);
    }

    return (
      <>
        {imageSrc && (
          <img
            src={require(`../../assets/common/menuicon/${imageName}.svg`)}
            size="26px"
            style={{ width: "26px", height: "26px" }}
          />
        )}
        {!imageSrc && (
          <img
            src={type === "custom" ? DefaultIcon : DefaultHistory}
            style={{ width: "26px", height: "26px" }}
            alt="Default Image"
          />
        )}
      </>
    );
  };
  const imgShow = (imageName, type) => {
    let imageSrc = null;
    const namepath = `menuicon/${imageName}`
    try {
      imageSrc = require(`../../assets/${namepath}.svg`);
      console.log(imageSrc,'imageSrc');
    } catch (error) {
      console.log(`Image ${imageName} not found`);
    }
    return (
      <>
        {imageSrc && (
          <img
            src={require(`../../assets/${namepath}.svg`)}
            size="26px"
            style={{ width: "26px", height: "26px" }}
          />
        )}
        {!imageSrc && (
          <img
            src={type === "custom" ? DefaultIcon : DefaultHistory}
            style={{ width: "26px", height: "26px" }}
            alt="Default Image"
          />
        )}
      </>
    );
  };

  const iconsRender = (name = [], type) => {
    const fieldarr = name.split("/");
    const firMenu = fieldarr[1];
    const secMenu = fieldarr[2];
    const arr = ["evtlog", "sysconf", "sysmain"];
    const isCommon = arr.includes(firMenu);
    if(isCommon){
      return imgCommonShow(secMenu, type)
    }else{
      return imgShow(secMenu, type);
    }
  };

  return (
    <div style={{ height: "390px" }} className="quickdropconbox">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 5px 10px 5px",
        }}
      >
        <div>{language("assembly.quickentru")}</div>
        <div style={{ color: "rgba(154,154,154,1)" }}>
          <Popover
            overlayClassName="custompopover"
            placement="rightTop"
            content={popoverContent}
          >
            <span style={{ cursor: "pointer" }}>
              {language("assembly.custom")}
              <RightOutlined />
            </span>
          </Popover>
        </div>
      </div>
      <div style={{ overflow: "auto" }}>
        <div
          class="grid-container"
          style={{ height: "266px", overflow: "hidden" }}
        >
          {list?.map((item, index) => (
            <div
              class={
                item.list.size == 2
                  ? item.list.direction == "transverse"
                    ? "grid-item two-grid"
                    : "grid-item two-grid1"
                  : "grid-item"
              }
              style={{
                backgroundColor: item.list.color,
                cursor: "pointer",
              }}
              onClick={() => {
                jHref(item.list.route);
              }}
            >
              {item.type == 2 ? (
                <></>
              ) : (
                <>
                  <div
                    className={
                      item.list.direction == "vertical" && item.list.size == 2
                        ? "psicon"
                        : "picon"
                    }
                  >
                    {iconsRender(item.list.route, "custom")}
                  </div>
                  <div className="pname">{item.list.name}</div>
                </>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "6px", height: "100px", overflow: "hidden" }}>
          <div class="grid-container">
            {list2?.map((item, index) => (
              <div
                class={
                  item.size == 2
                    ? item.direction == "transverse"
                      ? "grid-item two-grid"
                      : "grid-item two-grid1"
                    : "grid-item"
                }
                style={{
                  backgroundColor: item.color,
                  cursor: "pointer",
                }}
                onClick={() => {
                  jHref(item.route);
                }}
              >
                {item.type == 2 ? (
                  <></>
                ) : (
                  <>
                    <div className={"picon"}>
                      {iconsRender(item.route, "history")}
                    </div>
                    <div className="pname">{routeName(item.route)}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
