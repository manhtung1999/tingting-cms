import { useEffect, useState } from 'react';
import superagent from 'superagent';
import { TOKEN_KEY } from '@/config/constant';
import config from '@/config/index';
export const useUploadFiles = file => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (file) {
            superagent
                .post(config.API_DOMAIN + 'api/v1/file/upload-file')
                .set('Authorization', 'Bearer ' + localStorage.getItem(TOKEN_KEY))
                .attach('file', file)
                .end((err, res) => {
                    if (res) {
                        let media =
                            file.type === 'video/mp4'
                                ? { ...res.body.data, type: 'video' }
                                : { ...res.body.data, type: 'image' };
                        setFiles([...files, media]);
                    }
                });
        }
    }, [file]);

    return [files, setFiles];
};
