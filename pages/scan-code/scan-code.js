Page({
  scan() {
    my.scan({
      type: 'qr',
      success: (res) => {
        my.navigateTo({
         url: '../oppen-door/oppen-door?qr_code='+res.code,
        }) ;
        my.alert({ title: res.code });
      },
    });
  }
})

