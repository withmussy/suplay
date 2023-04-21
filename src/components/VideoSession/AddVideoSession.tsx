import React from 'react';
import styled from 'styled-components';
import {Card, Form, Button, Upload, message} from 'antd';
import {UploadOutlined, PlayCircleFilled} from '@ant-design/icons';

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

interface PropsType {
  onPlay: (data: DataToPlayType ) => void;
}

export type DataToPlayType = {video: string; subtitle?: string}

type FormValuesType = {
  subtitle: {
    file: {
      originFileObj: File;
    };
  };
  video: {
    file: {
      originFileObj: File;
    };
  };
};

const AddVideoSession = (props: PropsType) => {
  const {onPlay} = props;

  const handlePlay = (values: FormValuesType) => {
    const {video, subtitle} = values;

    const videoBlob = window.URL.createObjectURL(video.file.originFileObj);

    let subtitleBlob = undefined;

    if (subtitle != undefined) {
      subtitleBlob = window.URL.createObjectURL(subtitle.file.originFileObj);
    }

    onPlay({video: videoBlob, subtitle: subtitleBlob});
  };

  const checkVideo = (file: File) => {
    const type = file.type.split('/')[0];

    if (type != 'video') {
      message.error('your file should be video');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const checkSubtitle = (file: File) => {
    const type = file.type;
    const ext = file.name.split('.').pop();

    if (type != 'application/x-subrip' && ext != 'srt') {
      message.error('your file should be srt');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <Wrapper title="video session" bodyStyle={{paddingBottom: 0}}>
      <Form {...formItemLayout} onFinish={handlePlay}>
        <Form.Item
          label="video"
          name="video"
          required
          rules={[{required: true, message: 'video file is required'}]}>
          <Upload beforeUpload={checkVideo}>
            <Button icon={<UploadOutlined />}>choose your file</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="subtitle"
          label="subtitle"
          rules={[{required: true, message: 'srt file is required'}]}
          extra="subtitle file format should be srt">
          <Upload beforeUpload={checkSubtitle}>
            <Button icon={<UploadOutlined />}>choose your file</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{span: 24}}>
          <Button
            type="primary"
            size={'large'}
            block
            htmlType="submit"
            icon={<PlayCircleFilled />}>
            Play
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default AddVideoSession;

const Wrapper = styled(Card)`
  z-index: 3;
  width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0;
`;
