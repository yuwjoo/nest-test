INSERT INTO
    role (name, describe)
VALUES
    ("admin", "管理员");

INSERT INTO
    role (name, describe)
VALUES
    ("user", "普通用户");

INSERT INTO
    user (account, password, nickname, roleName)
VALUES
    ("admin", "123456", "管理员", 'admin');