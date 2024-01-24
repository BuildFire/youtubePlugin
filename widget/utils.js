function cropVedioThumbnial(image, itemListLayout) {
    let imageUrl = '';
    switch (itemListLayout) {
        case 'List_Layout_4':
            imageUrl = buildfire.imageLib.cropImage(image, { size: "m", aspect: "1:1" });
            break;
        case 'List_Layout_3':
            imageUrl = buildfire.imageLib.cropImage(image, { size: "m", aspect: "16:9" });
            break;
        case 'List_Layout_2':
            imageUrl = buildfire.imageLib.cropImage(image, { size: "m", aspect: "16:9" });
            break;
        case 'List_Layout_1':
        default:
            imageUrl = buildfire.imageLib.cropImage(image, { size: "m", aspect: "16:9" });
            break;
    }

    return imageUrl
}