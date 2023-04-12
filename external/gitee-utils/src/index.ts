import { Context, Schema } from 'koishi'

export const name = 'gitee-utils'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    let bot = ctx.bots[1]
    ctx.router['post']('/gitee', async (ctx) => {
        try {
            // console.log(ctx.request.body)
            // 监听gitee的Webhook请求
            let data: any = ctx.request.body
            let commits: any = data.commits
            for (let commit of commits) {
                let message = `提交者：${commit.author.name}\n提交信息：${commit.message}\n提交时间：${commit.timestamp}\n提交链接：${commit.url}`
                await bot.sendMessage('536635853', message)
                console.log(message)
            }
            // 返回成功
            ctx.body = 'success'
        } catch (e) {
            console.log(e);
            await bot.sendMessage('536635853', 'test')
        }
    })
    // write your plugin here
}

let data = {
    "hook_name": "push_hooks",
    "password": "pwd",
    "hook_id": 1,
    "hook_url": "http://gitee.com/liwen/gitos/hooks/1/edit",
    "timestamp": "1576754827988",
    "sign": "rLEHLuZRIQHuTPeXMib9Czoq9dVXO4TsQcmQQHtjXHA=",
    "ref": "refs/heads/change_commitlint_config",
    "before": "0000000000000000000000000000000000000000",
    "after": "1cdcd819599cbb4099289dbbec762452f006cb40",
    "created": true,
    "deleted": false,
    "compare": "https://gitee.com/oschina/gitee/compare/0000000000000000000000000000000000000000...1cdcd819599cbb4099289dbbec762452f006cb40",
    "commits": [
        {
            "id": "1cdcd819599cbb4099289dbbec762452f006cb40",
            "tree_id": "db78f3594ec0683f5d857ef731df0d860f14f2b2",
            "distinct": true,
            "message": "Update README.md",
            "timestamp": "2018-02-05T23:46:46+08:00",
            "url": "https://gitee.com/oschina/gitee/commit/1cdcd819599cbb4099289dbbec762452f006cb40",
            "author": {
                "time": "2018-02-05T23:46:46+08:00",
                "name": "robot",
                "email": "robot@gitee.com",
                "username": "robot",
                "user_name": "robot",
                "url": "https://gitee.com/robot"
            },
            "committer": {
                "name": "robot",
                "email": "robot@gitee.com",
                "username": "robot",
                "user_name": "robot",
                "url": "https://gitee.com/robot"
            },
            "added": null,
            "removed": null,
            "modified": [
                "README.md"
            ]
        }
    ],
    "head_commit": {
        "id": "1cdcd819599cbb4099289dbbec762452f006cb40",
        "tree_id": "db78f3594ec0683f5d857ef731df0d860f14f2b2",
        "distinct": true,
        "message": "Update README.md",
        "timestamp": "2018-02-05T23:46:46+08:00",
        "url": "https://gitee.com/oschina/gitee/commit/1cdcd819599cbb4099289dbbec762452f006cb40",
        "author": {
            "time": "2018-02-05T23:46:46+08:00",
            "name": "robot",
            "email": "robot@gitee.com",
            "username": "robot",
            "user_name": "robot",
            "url": "https://gitee.com/robot"
        },
        "committer": {
            "name": "robot",
            "email": "robot@gitee.com",
            "username": "robot",
            "user_name": "robot",
            "url": "https://gitee.com/robot"
        },
        "added": null,
        "removed": null,
        "modified": [
            "README.md"
        ]
    },
    "total_commits_count": 0,
    "commits_more_than_ten": false,
    "repository": {
        "id": 120249025,
        "name": "Gitee",
        "path": "gitee",
        "full_name": "开源中国/Gitee",
        "owner": {
            "id": 1,
            "login": "robot",
            "avatar_url": "https://gitee.com/assets/favicon.ico",
            "html_url": "https://gitee.com/robot",
            "type": "User",
            "site_admin": false,
            "name": "robot",
            "email": "robot@gitee.com",
            "username": "robot",
            "user_name": "robot",
            "url": "https://gitee.com/robot"
        },
        "private": false,
        "html_url": "https://gitee.com/oschina/gitee",
        "url": "https://gitee.com/oschina/gitee",
        "description": "",
        "fork": false,
        "created_at": "2018-02-05T23:46:46+08:00",
        "updated_at": "2018-02-05T23:46:46+08:00",
        "pushed_at": "2018-02-05T23:46:46+08:00",
        "git_url": "git://gitee.com:oschina/gitee.git",
        "ssh_url": "git@gitee.com:oschina/gitee.git",
        "clone_url": "https://gitee.com/oschina/gitee.git",
        "svn_url": "svn://gitee.com/oschina/gitee",
        "git_http_url": "https://gitee.com/oschina/gitee.git",
        "git_ssh_url": "git@gitee.com:oschina/gitee.git",
        "git_svn_url": "svn://gitee.com/oschina/gitee",
        "homepage": null,
        "stargazers_count": 11,
        "watchers_count": 12,
        "forks_count": 0,
        "language": "ruby",
        "has_issues": true,
        "has_wiki": true,
        "has_pages": false,
        "license": null,
        "open_issues_count": 0,
        "default_branch": "master",
        "namespace": "oschina",
        "name_with_namespace": "开源中国/Gitee",
        "path_with_namespace": "oschina/gitee"
    },
    "sender": {
        "id": 1,
        "login": "robot",
        "avatar_url": "https://gitee.com/assets/favicon.ico",
        "html_url": "https://gitee.com/robot",
        "type": "User",
        "site_admin": false,
        "name": "robot",
        "email": "robot@gitee.com",
        "username": "robot",
        "user_name": "robot",
        "url": "https://gitee.com/robot"
    },
    "enterprise": {
        "name": "开源中国",
        "url": "https://gitee.com/oschina"
    }
}


