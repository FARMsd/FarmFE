import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import FileCarousel from "../../common/carousel/FileCarousel";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import { Calendar } from "primereact/calendar";
import {
  createBussinesPost,
  getBussinesPost,
  getFarmerPost,
} from "../../api/homeFarmer";
import { uploadFile, uploadImage } from "../../api/file";
import moment from "moment";
import { getFromLocalStorage } from "../../constant/utils";
import { categories } from "../../constant/constant";

const HomeCompanyPage = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State để quản lý modal;

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [standardRequirements, setStandardRequirements] = useState("");
  const [otherRequirement, setOtherRequirement] = useState("");
  const [images, setImages] = useState<number[]>([]);
  const [files, setFiles] = useState<number[]>([]);

  useEffect(() => {
    getFarmerPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Đảo trạng thái mở rộng của item hiện tại
    }));
  };

  const showModal = () => {
    setModalVisible(true); // Mở modal
  };

  const hideModal = () => {
    setModalVisible(false); // Đóng modal
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const handleReset = () => {
    setSearchTerm("");
    setFromDate(null);
    setToDate(null);
    setMinPrice(0);
    setMaxPrice(0);
    getBussinesPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    const data = {
      searchTerm,
      fromDate,
      toDate,
      minPrice,
      maxPrice,
    };
    getFarmerPost(data)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [file, setFile] = useState<any>(null);

  const onFileChange = (event: any) => {
    setFile(event.target.files[0]); // Get the first selected file
  };

  const onUploadImage = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadImage(formData).then((x) => {
      const id = x.data.data.data.id;
      setImages((prv) => [...prv, id]);
    });
  };

  const onUploadFile = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadFile(formData).then((x) => {
      const id = x.data.data.data.id;
      setFiles((prv) => [...prv, id]);
    });
  };

  const handleCreate = () => {
    const formData = {
      content,
      productName,
      quantity,
      category,
      unitPrice,
      standardRequirements,
      otherRequirement,
      images,
      files,
    };
    createBussinesPost(formData).then(() => {
      hideModal();
    });
  };

  const footerContent = (
    <div className="flex justify-end mt-10">
      <Button className="mr-5" onClick={handleCreate} severity="help">
        Đăng Tin
      </Button>
      <Button severity="danger" onClick={hideModal}>
        Hủy Bỏ
      </Button>
    </div>
  );
  return (
    <>
      <div className="grid grid-cols-12 p-4">
        <div className="col-span-3 p-4 text-center hidden md:block">
          <Card className="rounded-3xl sticky top-28">
            <div className="text-start font-bold">Tìm kiếm:</div>
            <div>
              <InputText
                type="text"
                className="w-full mt-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-start font-bold mt-2">Từ ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              value={fromDate}
              maxDate={toDate ?? new Date()}
              onChange={(e) => setFromDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Đến ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              minDate={fromDate ?? new Date()}
              value={toDate}
              onChange={(e) => setToDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Giá tối thiểu:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={minPrice + ""}
                onChange={(e) =>
                  setMinPrice(e.target.value ? parseFloat(e.target.value) : 0)
                }
              />
            </div>
            <div className="text-start mt-2 font-bold">Giá tối đa:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={maxPrice + ""}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? parseFloat(e.target.value) : 0)
                }
              />
            </div>
            <div className="flex justify-between mt-5">
              <Button className="" severity="help" onClick={handleSearch}>
                Tìm kiếm
              </Button>

              <Button className="" severity="danger" onClick={handleReset}>
                Mặc định
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-9 p-4 text-center">
          <Card className="rounded-3xl">
            <div className="grid grid-cols-12 gap-2">
              <Avatar
                className="w-12 h-12 col-span-2 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                image={getFromLocalStorage("avatar") ?? ""}
                shape="circle"
              />
              <InputText
                placeholder="Đăng gì đó lên tường nhà bạn"
                type="text"
                className="w-full ml-2 col-span-10 sm:col-span-11"
                onClick={showModal} // Sử dụng col-span-10 trên màn hình nhỏ
              />

              {/* Modal */}
              <Dialog
                footer={footerContent}
                header="Thông tin bài đăng"
                visible={isModalVisible}
                onHide={hideModal}
                className="h-[950px] w-[950px]"
              >
                <div className="grid grid-cols-12 gap-4 ">
                  <div className="col-span-4">
                    <label className="mr-2">Tên nông sản:</label>
                    <InputText
                      className="w-5/6"
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Số lượng:</label>
                    <InputText
                      className="w-full"
                      type="number"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Loại Hàng:</label>
                    <InputText
                      className="w-full"
                      onChange={(e) => setCategory(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <label className="mr-2">Yêu cầu tiêu chuẩn:</label>
                    <InputText
                      className="w-full"
                      onChange={(e) => setStandardRequirements(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Các yêu cầu khác:</label>
                    <InputText
                      className="w-full"
                      onChange={(e) => setOtherRequirement(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Giá từng sản phẩm:</label>
                    <InputText
                      className="w-full"
                      type="number"
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 h-60">
                  <div className="col-span-full h-52">
                    <label className=" col-span-3">Mô tả:</label>
                    <Editor
                      placeholder="Nhập nội dung"
                      className="h-40"
                      onTextChange={(e: any) => setContent(e.htmlValue)}
                    />
                  </div>
                </div>
                <Divider />
                <div>Chọn hình ảnh</div>
                <div className="card col-span-full">
                  <input id="file-upload" type="file" onChange={onFileChange} />
                  <button
                    onClick={onUploadImage}
                    className="p-button p-component p-mt-2"
                  >
                    Tải lên
                  </button>
                </div>
                <Divider />
                <div>Chọn file</div>
                <div className="card col-span-full">
                  <input id="file-upload" type="file" onChange={onFileChange} />
                  <button
                    onClick={onUploadFile}
                    className="p-button p-component p-mt-2"
                  >
                    Tải lên
                  </button>
                </div>
              </Dialog>
            </div>
          </Card>
          {listObjects?.map((item: any) => (
            <div key={item?.id}>
              <Card className="mt-5 rounded-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="w-12 h-12 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                      image={item?.avatar}
                      shape="circle"
                    />
                    <div>
                      <div>
                        <strong className="mr-1">Người đăng bài:</strong>
                        {item?.createdBy}
                      </div>
                      <div className="text-start">
                        <strong className="mr-1">Ngày đăng bài:</strong>
                        {moment(item?.createdDate).format("DD.MM.YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Tên sản phẩm:</strong>
                  {item?.productName}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1"> Số lượng:</strong> {item?.quantity}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Loại sản phẩm:</strong>{" "}
                  {categories.find((x) => x.label === item?.category)?.name}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Giá từng sản phẩm:</strong>{" "}
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item?.unitPrice || 0)}
                  </span>
                </div>
                <div className="flex justify-start text-start">
                  <div>
                    {/* Hiển thị nội dung văn bản */}
                    <p>
                      {expandedItems[item.id] ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.content,
                          }}
                        ></span>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.content.slice(0, 100),
                          }}
                        ></span>
                      )}
                      {item.content.length > 100 && (
                        <span
                          className="text-blue-500 cursor-pointer ml-2"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {expandedItems[item.id] ? "Rút gọn" : "... Xem thêm"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {item?.postFiles.length > 0 ? (
                  <>
                    <Divider />
                    <FileCarousel files={item?.postFiles ?? []} />
                  </>
                ) : (
                  <></>
                )}

                {item?.postImages.length > 0 ? (
                  <>
                    <Divider />
                    <ImageCarousel images={item?.postImages ?? []} />
                  </>
                ) : (
                  <></>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeCompanyPage;
