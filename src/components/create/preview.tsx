import React from 'react';
import { useSession } from 'next-auth/client';
import CardDef from 'src/components/cards/card-def/card-def';
import styles from 'src/components/create/scss/create.module.scss';
import { getFileType } from 'src/utils/common';

type PreviewProps = {
  itemState: object,
  file: TFile,
  offerState: object,
}

export default function Preview({ itemState, file, offerState }: PreviewProps) {
  const [session] = useSession();

  // @ts-ignore
  const profile: TUser = session?.profile;
  const type = getFileType(file.data?.type ?? '');

  const item: INftItemExtended = {
    id: '',
    owner: profile ? profile.id : '',
    ownerProfile: profile,
    // @ts-ignore
    name: itemState.name ?? '',
    // @ts-ignore
    description: itemState.description ?? '',
    type: type,
    url: file.src,
    author:  profile ? profile.id : '',
    authorName:  profile ? profile.name : '',
    authorProfile: profile,
    // @ts-ignore
    offerDetails: {
      price: offerState['price']
    }
  };

  const previewItem = <CardDef item={item}/>;

  return <>
    <div className={styles.create__label}>
      Preview
    </div>
    <div className={styles.create__preview}>
      {file.src
        ? previewItem
        : <div className={styles['create__preview-def']}>
          Upload file to preview your brand new NFT
        </div>}
    </div>
  </>;
}
