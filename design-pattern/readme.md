

# 팁팁

```
export class GameData {
    public static stat:GameStat = null;
};
```

* 널 초기화 하려는데 아래 같은 에러가 뜬다면,

```'null' 형식은 'GameStat' 형식에 할당할 수 없습니다.ts(2322)```

tsconfig.json 파일에서 ```"strictNullChecks": false,``` 를 추가해서 검사를 막는다.

