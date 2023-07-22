const config = {
  port: 3031,
  oss: 'http://127.0.0.1:3031',
  secret: 'QdabuliuQ',
  expiresIn: '10h',  // jwt有效期
  pattern: {
    email: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
    phone: /^[1][3,4,5,7,8][0-9]{9}$/,
    password: /^[\S]{6,12}$/,
  },
  ownEmail: '2714499297@qq.com',
  SMTPpass: 'ryieaitcaawsdfgh',
  privateKey: `
  -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEmumvLGO7eOCP
59ZBMkeyyXhW8fccoMjn4w6B5rzdJElvm3zM6Vo5Pwc7vBPlfQT835Fl0qZZINRo
8TVe1alTLEMk1GfE02djBCRaxNrbXOcC6vnM3q1auP8cJmqjiZ2rNS0ChplkCI4K
lJvt+ALGSNmZIHRgkpKlxXuG7cgMR1aNDJxnsI1Lu8SGn3RU/Qf5KiQn2h28Sz0y
TIX8wVJGgwmrFcwzgZ3tx8mBBkoS6ME+CFcyqbq12Zc+N5mfi8hCALvRgZHrGiLN
mYFi0NigQPL1O7+ck5y6dKizU7GKoh90RrmWAPWU2s+VD/6eZ+ievUJGcpcgFv8o
LpeJ0PRzAgMBAAECggEAcH/oahlvdC4F6bKSsjnQNyj72Fyat2H1tGMDwSdEORJz
hw6lCigZPZqoS/EiPXYdbYmMjIRONcAIa4hirsJ6IqK4RRHZ0xHZHhqXpuzwAwgV
FGFa0XU2IyyqpfQBn1S2yOojuEdG7KvMg5dn5nK9O7Mh+HJOxZf5nCv1tE7J4uPJ
FhKlNrva9MJ8TsWEVm/mNVg60dMiCmVOqc5tixRy9P2g8brpCTTcZ+TomeiPW4us
p0dqV/owtLBxzjWFVlqb2Q0W+Q6NOkzGhcabAz2HMwtUTvHhkpgqgX8TgTh0rLsy
0KoYTdVaXq5ELdq/B4J8bvBc4lHD9Vpvh9aOeVw5qQKBgQD5p7TurSdu8jvb3gdg
+PDlItBTQb3uDyzagbURJq5AVQfqnPemrSlYOE7d02gi2WOKjPi0ctRBv1jSju8a
rAqOa391MG6vwU4+7hV7HhxnQkKVKCHoCggfOypILK6ItTfwf+XJw+Ws+8bsP/7K
44LHpDFvykm1+qmHAFcrcqhZvQKBgQDJmg4WUIwR2JsT6M/eI/5XmPiO1q689dv9
n3hdvt8PEPsuBe8NYPM1dqjjDr5w0D+5ufEd+naBLszMXeqEzyW1bUnu9KWW6Luy
7Gc7WGjC7RR32WMnrZDeakZO91nGfXMWl4FEaj5zxnZvpJ3iECXBay2AewkkKTaw
B05Nptgx7wKBgF26zh4x2jU4MqsIf+Kzc9XDLU2kyAcBoYhj3DQVPqSeh/tYdU4Z
gwVBFrMHtPgof8u7w4AUAIayrUlYKoLsBoaT62V3Codn3tWXk28Gzgkiglb3m0s/
wO7gyq4QQHLI/riHfCE1MByy5ms6V5GauzXy+jCLVQNCmbU6tn90a6pNAoGAL+k7
xdPYpfkbScz/caSOMpU5JQEiP+gSIyE+AtF0w2jeuN5SJJTQ1/jeRC/h1H+5VVM6
WUyH00WjCEKdlHiCVq6lbnOX0th2mxwRoInvQ7wCLEVuiiR2lFUfZm7kWAbCTjEt
WGwDcZJN3VR67Rm3T1NAWhNjZcOhqo3h7xRituMCgYEAzGRY/FhalO9WsErZry9t
y5MyzQ57UYcwYXfHcwH5W47SViZnnriGi4hEcdtio1KfGJQKk9uLVRjF9kT/VJTi
eJuos7qJudiDtLvXHLXIh3xMoFVu1Aun79jBSgWvu8oOIxW3oATW/jaDYoqJY3o3
Q/viE0Aku/0PEle5dc5MyqM=
-----END PRIVATE KEY-----
  `
}
module.exports = config