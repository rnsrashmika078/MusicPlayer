const test = () => {
  ipcMain.handle("get-metadata-array", async (_event, filePath: string[]) => {
    try {
      // const metadata = await parseFile(filePath);
      const metaData = filePath.map(async (item) => await parseFile(item));
      console.log("meta data", filePath);
     
      // let pictureDataUrl = null;
      // if (metadata.common.picture && metadata.common.picture.length > 0) {
      //   const picture = metadata.common.picture[0]; // first image
      //   const base64String = Buffer.from(picture.data).toString("base64");
      //   pictureDataUrl = `data:${picture.format};base64,${base64String}`;
      // }
      // return {
      //   title: metadata.common.title,
      //   artist: metadata.common.artist,
      //   album: metadata.common.album,
      //   picture: pictureDataUrl, // Array of images
      // };
    } catch (err) {
      return { error: err instanceof Error && err.message };
    }
  });

  return <div>test</div>;
};

export default test;
