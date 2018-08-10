网易云音乐
歌曲的获取方式：
1、搜索歌曲，获取歌曲id；
2、通过歌曲id获取歌曲的详情(detail)，获取歌曲的码率信息(默认128000)；
3、根据歌曲id,码率信息获取歌曲的url信息；

评论获取方式：
获取歌曲id后即可通过对应url获得

search(type = 0):
paramters: keyword, offset, limit, type(0,5)

obtain song detail(type = 1):
key: {"id":"36990266","c":"[{\"id\":\"36990266\"}]","csrf_token":""}
url:/weapi/v3/song/detail?csrf_token=
structure: {songs:[id:'',al:{},ar:[]], priviriges:[fl:'',pl:'',maxbr:''], code: ''}
parameters: songid

obtain song url(type 2):
p1: {"ids":"[36990266]","br":128000,"csrf_token":""}
url: /weapi/song/enhance/player/url?csrf_token=
paramters: songid, (songbr)

obtain lyric(type 3): 
key: {"id":"36990266","lv":-1,"tv":-1,"csrf_token":""}
url: /weapi/song/lyric?csrf_token=
paramters: songid

obtain comments(type 4):
key: {"rid":"R_SO_4_36990266","offset":"0","total":"true","limit":"20","csrf_token":""}
url: /weapi/v1/resource/comments/R_SO_4_36990266?csrf_token=
paramters: songid, offset, limit

QQ音乐
歌曲获取方式
1、搜索歌曲，获得歌曲id,mid等信息
2、通过获取到的信息获取歌曲的url信息

评论获取方式：


获取单首歌曲的详细信息(type = 1):
url: /v8/fcg-bin/fcg_play_single_song.fcg?format=jsonp&songmid=#{songmid}
注意：返回数据有括号
paramters: songmid

搜索歌曲列表(type = 0):
url: /soso/fcgi-bin/client_search_cp?new_json=1&aggr=1&cr=1&p=#{page}&n=#{number}&w=#{keyword}
注意：返回数据有括号
paramters: keyword, type, offset, limit

播放链接(type = 2)：
url: /base/fcgi-bin/fcg_music_express_mobile3.fcg?cid=205361747&songmid=#{songmid}&filename=C400#{media_mid}.m4a&guid=3057399792
http://dl.stream.qqmusic.qq.com/C400004TXEXY2G2c7C.m4a?vkey=2DBAC7AF15B4085D2C01AEB6F6DF969716AA1511D9F18ADD3365D8DD7269C08D82FC721A9678233754CECBE90C64444369723EBB4F3B20EE&guid=1707943335
paramters: songmid, media_mid

歌词(type = 3)：
url: /lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=#{songmid}
需要添加Header: Referer: https://y.qq.com/portal/player.html
获取的数据需要使用Base64解密
注意：返回数据有括号
paramters: songmid

评论(type = 4)：
/base/fcgi-bin/fcg_global_comment_h5.fcg?biztype=1&topid=#{songid}&cmd=8&pagenum=#{page}&pagesize=#{pageSize}
注意：page从0开始
paramters: songid

搜索框信息的搜索(type = 5):
url: /splcloud/fcgi-bin/smartbox_new.fcg?key=#{keyword}
paramters: keyword, type

获取专辑图链接：
http://y.gtimg.cn/music/photo_new/T002R300x300M0000${album.mid}.jpg?max_age=2592000