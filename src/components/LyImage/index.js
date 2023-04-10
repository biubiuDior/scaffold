import React from 'react';
import {Icon, message, Modal, Upload} from 'antd';
import PropTypes from "prop-types";
import {createUuid} from '../../utils/utils';
import {getUserCache} from "@/utils/user";
import styles from './index.less';

const fileDocDownloadPath = 'api/docrepo/download?attachmentId=';

/**
 *
 *   图片墙使用说明：
 *   onRemove: this.onImageRemove.bind(this), 非必须, 图片删除之后回传删除图片给父组件的方法
 *   onChange: this.onChange.bind(this), 非必须, 值改变时执行的方法
 *   numberOfLimit: 2, 必须, 图片墙允许上传的图片张数，超过numberOfLimit上传按钮自动隐藏
 *   numberOfSize: 5,  必须, 图片墙允许上传图片大小的最大值，超过numberOfSize的话直接不上传
 *   imageList: ['0264a687-baa4-490f-92f5-e988dcd8d976','0264a687-baa4-490f-92f5-e988dcd8d976'] 非必须, 如果是编辑模式下，需要回显已经保存的图片信息，注意一下需要构造如下类型数据才能显示出来：
 */
class LyImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadedImageList: [],          //已上传图片
      previewImageVisible: false,     //是否预览图片标识
      previewImageUrl: '',            //预览图片的URL
      previewImageName: '',           //预览图片的名称
      initClassName:'img'+createUuid()
    }
  }

  //设置props默认值
  static defaultProps = {
    saveType: 'file',       //保存的类型，默认为file文档库，可选的值: 'file'(上传文档库)、'base64'(保存数据库)
    imageList: [],          //设置默认上传的图片 格式:['0264a687-baa4-490f-92f5-e988dcd8d976','0264a687-baa4-490f-92f5-e988dcd8d976'] 非必须, 如果是编辑模式下，需要回显已经保存的图片信息
    numberOfLimit: 1,       //最多允许上传多少张图片 默认为1张
    numberOfSize: '2MB',        //默认上传大小限制2MB,必须填写单位，只能是MB或者KB
    disabled: false,        //是否禁用
    onRemove: () => {       //删除成功回调
    },
    onChange: () => {
    },                      //值改变时的回调
    base64UploadUrl: '',    //base64上传图片路径
    uploadText:'' //上传的提示文案，例如:上传身份证照片
  };

  //组件render之前组装已经上传成功的图片信息uploadedImageList,主要用于回显图片
  componentWillMount() {
    let saveType = this.props.saveType || 'file';
    if (saveType === 'base64') {
      if (this.props.imageList.length > 0) {
        let uploadedImageList = [];
        this.props.imageList.map((base64Code) => {
          uploadedImageList.push({
            uuid: base64Code,
            uid: base64Code,
            url: base64Code
          });
        });
        this.setState({
          uploadedImageList: uploadedImageList
        });

        let imageList = [];
        uploadedImageList.map((file) => {
          let obj = {
            uuid: file.uuid,
            base64Url: file.url
          };
          imageList.push(obj);
        });

        if (this.props.onChange && typeof this.props.onChange === "function") {
          this.props.onChange(imageList);
        }
      }
    } else {
      if (this.props.imageList.length > 0) {
        let uploadedImageList = [];
        this.props.imageList.map((uuid) => {
          uploadedImageList.push({
            uuid: uuid,
            uid: uuid,
            url: fileDocDownloadPath + uuid
          });
        });
        this.setState({
          uploadedImageList: uploadedImageList
        });

        let imageList = [];
        uploadedImageList.map((file) => {
          let obj = {uuid: file.uuid};
          imageList.push(obj);
        });

        if (this.props.onChange && typeof this.props.onChange === "function") {
          this.props.onChange(imageList);
        }
      }
    }
  }

  //图片预览事件
  handlePreview = (file) => {
    this.setState({
      previewImageUrl: file.url || file.thumbUrl,
      previewImageName: file.name,
      previewImageVisible: true
    });
  };

  //取消图片预览事件
  handlePreviewCancel = () => {
    this.setState({
      previewImageVisible: false
    });
  };

  //文件上传改变事件
  handleChange = (e) => {
    const saveType = this.props.saveType || 'file';
    let fileList = e.fileList;
    let fileStatus = e.file.status;

    if (fileStatus === 'uploading') {    //上传中
    } else if (fileStatus === 'done') {  //上传成功
      let response = e.file.response;
      if (!response) {
        message.error("抱歉，文件由于未知原因上传失败!");
        return;
      }
      let responseMeta = response.meta;
      if (saveType === 'file') {   //上传到文档库
        //上传成功(success为true并且响应码为200)
        if (responseMeta && responseMeta.success && responseMeta.statusCode === 200) {
          fileList = fileList.map((file) => {
            if (file.uid === e.file.uid) {
              // file.uuid = response.data.ssbh;
              file.uuid = response.data.bh;
            }
            return file;
          });

          this.getUploadedImage(fileList, 'file');
        } else {
          message.error("抱歉，文件由于未知原因上传失败!");
          //过滤上传失败的图片
          fileList = this.filterUploadFailFile(e.fileList, e.file);
        }

      } else if (saveType === 'base64') {  //用于保存数据库
        this.getImageBase64(e.file.originFileObj, (imageUrl) => {
          //上传成功
          if (response.code === 200) {
            fileList = fileList.map((file) => {
              if (file.uid === e.file.uid) {
                file.uuid = imageUrl;
                file.base64Url = imageUrl;
              } else {
                file.base64Url = file.thumbUrl || file.url;
              }
              return file;
            });
            this.getUploadedImage(fileList, 'base64');
          } else {
            message.error("抱歉，文件由于未知原因上传失败!");
            //过滤上传失败的图片
            fileList = this.filterUploadFailFile(e.fileList, e.file);
          }
        });

      }
    } else if (fileStatus === 'error') {  //上传出错
      message.error("抱歉，文件由于未知原因上传失败!");
      //过滤上传失败的图片
      fileList = this.filterUploadFailFile(e.fileList, e.file);
    }
    if (fileStatus) {
      this.setState({
        uploadedImageList: fileList
      });
    }
  };

  //获取图片Base64
  getImageBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  //过滤上传失败的图片
  filterUploadFailFile = (list, failUploadedFile) => {
    return list.filter(file =>
      file.uid !== failUploadedFile.uid
    );
  };

  //获取上传成功的图片
  getUploadedImage = (fileList, saveType) => {
    if (saveType === 'base64') {
      let uploadedImageList = [];
      fileList.map((file) => {
        let obj = {
          uuid: file.uuid,
          base64Url: file.base64Url
        };
        uploadedImageList.push(obj);
      });

      //父组件回调方法，在父组件可以拿到已经上传成功的图片信息
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange(uploadedImageList);
      }
    } else {
      let uploadedImageList = [];
      fileList.map(file => {
        let obj = {
          uuid: file.uuid
        };
        uploadedImageList.push(obj);
      });

      //父组件回调方法，在父组件可以拿到已经上传成功的图片信息
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange(uploadedImageList);
      }
    }
  };

  //上传文件之前的钩子，参数为准备上传的文件，若返回 false 则停止上传
  //一般在beforeUpload方法内限制文件上传的格式以及大小
  handelBeforeUpload = (file) => {
    let fileType = file.type;
    let fileName = file.name;
    //判断是否支持该文件格式
    let isInvalidFileType = !fileType || fileType.length < 1;
    if (isInvalidFileType) {
      message.error('抱歉，不支持上传该格式的文件！');
      return !isInvalidFileType;
    }

    let availFileSuffix = ['.png', '.PNG', '.jpg', '.JPG', '.bpm', '.BPM', '.gif', '.GIF'];
    let fileSuffixName = fileName.substring(file.name.lastIndexOf('.'));
    let isAvailableSuffix = availFileSuffix.includes(fileSuffixName);
    if (!isAvailableSuffix) {
      let msg = '抱歉，只支持上传【' + availFileSuffix.join(' || ') + '】格式的文件！';
      message.error(msg);
      return isAvailableSuffix;
    }

    //限制上传文件大小(默认上传大小限制2MB)
    let availSize = (this.props.numberOfSize || '2M').toUpperCase();
    let availSizeLong =  availSize.endsWith("MB") ? parseFloat(availSize)*1024*1024: parseFloat(availSize)*1024;

    let fileSize = file.size ;
    const isOverSize = fileSize > availSizeLong;

    if (isOverSize) {
      let msg = '抱歉，上传图片大小最大不能超过' + availSize;
      message.error(msg);
      return !isOverSize;
    }
    return true;
  };

  //删除图片事件
  handleRemove = (file) => {
    let uploadedImageList = this.state.uploadedImageList;
    for (let index = 0, len = uploadedImageList.length; index < len; index++) {
      if (uploadedImageList[index].uid === file.uid) {
        uploadedImageList.splice(index, 1);
        break;
      }
    }
    this.setState({
      uploadedImageList: uploadedImageList
    });

    //组装数据返回给父组件，包含文档库的uuid以及文件名称
    let imageList = [];
    uploadedImageList.length > 0 && uploadedImageList.map((file) => {
      let obj = {uuid: file.uuid};
      imageList.push(obj);
    });

    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(imageList);
    }

    //如果有需要对删除的图片做删除文档库等操作，回传给父组件进行处理
    if (this.props.onRemove && typeof this.props.onRemove === 'function') {
      this.props.onRemove(file.uuid);
    }
  };

  handleHeader = () => {
    let config = {};
    //如果是开发环境，把登录用户ID写入请求头，防止后端接口不经过网关获取当前登录用户信息报错
    const nodeEnv = process.env.NODE_ENV || 'development';
    if(nodeEnv==='development' && getUserCache()){
      config.loginUserId = getUserCache().userId
    }
    return config;
  }

  uploadButton = () => {
    if(this.props.children){
      return this.props.children;
    }else{
      return  <div>
                <Icon type="plus" className={styles.upIcon}/>
                <div className={styles.picturewall_ant_upload_text}>{this.props.uploadText || '上传'}</div>
              </div>
    }
  }

  render() {
    const {previewImageVisible, previewImageUrl, uploadedImageList, previewImageName ,initClassName } = this.state;
    const numberOfLimit = this.props.numberOfLimit || 1;    //默认最多上传一张图片
    const saveType = this.props.saveType || 'file';      //默认上传到文档库
    const { width = 104,height = 104 , className = initClassName} = this.props;
    const newWidth = parseInt(width);
    const newHeight = parseInt(height);


    //根据saveType构造上传的url
    const action = saveType === 'file' ? 'zuul/docrepo/upload' : this.props.base64UploadUrl;
    //请求发送的数据
    let requestData = saveType === 'file' ? {
      uuid: createUuid(),
      type: '1'
    }  : {};

    const params = {
      name: 'file',
      action: action,  //图片上传路径
      accept: 'image/*',   //接受上传的文件类型,指定为image/**的话，弹出选择文件窗口的时候只会显示图片类型文件，过滤掉.txt、.xsl等非图片文件
      listType: 'picture-card',  //图片墙样式
      multiple: false,  //是否允许多选
      fileList: uploadedImageList,  //已上传的图片
      data: requestData,  //上传所需参数
      headers: this.handleHeader(), //设置上传的请求头部，IE10 以上有效
      onRemove: this.handleRemove,  //删除执行的方法
      beforeUpload: this.handelBeforeUpload, //图片上传前执行的方法
      onPreview: this.handlePreview, //预览图片执行的方法
      onChange: this.handleChange,  //值改变执行的方法
      className: className
    };

    return (
      <>
        <Upload {...params}>
          {uploadedImageList.length >= numberOfLimit ? null : this.uploadButton()}
        </Upload>
       <Modal visible={previewImageVisible} footer={null} onCancel={this.handlePreviewCancel}>
          <img alt={previewImageName} style={{width: '100%'}} src={previewImageUrl}/>
        </Modal>
        <style jsx={'true'} global={'true'}>
          {`
              .${className} .ant-upload-list-picture-card .ant-upload-list-item{
                width:${newWidth}px;
                height:${newHeight}px;
              }
              .${className} .ant-upload-list-picture-card-container{
                width:${newWidth}px;
                height:${newHeight}px;
              }
              .${className} .ant-upload.ant-upload-select-picture-card{
                width:${newWidth}px;
                height:${newHeight}px;
              }
          `}
          </style>

      </>
    );
  }
}

//属性检查
// LyImage.PropTypes = {
//   imageList: PropTypes.array,         //初始化图片信息
//   numberOfLimit: PropTypes.number,    //允许上传的图片张数
//   numberOfSize: PropTypes.string,     //允许上传的图片大小，默认上传大小限制2MB,必须填写单位，只能是MB或者KB
//   disabled: PropTypes.bool,           //是否禁用
//   base64UploadUrl: PropTypes.string,  //base64图片上传路径
//   onRemove: PropTypes.func,           //删除成功回调
//   onChange: PropTypes.func,           //值改变回调
// };

export default LyImage;
