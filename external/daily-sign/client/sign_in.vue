<template>
    <div class="page">
        <div class="sign-card">
            <div class="title">
                哟，来签到了？
            </div>
            <div class="content">
                大吉
                <div class="little-text">
                    诸事皆宜
                </div>
                <div class="little-text">
                    利东南
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    width: calc(100vw - 64px);
    height: 100vh;
    position: absolute;
    left: 64px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sign-card {
    width: 400px;
    height: 600px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid #ccc;
}

.content {
    font-size: 100px;
    font-weight: 700;
    color: #f00;
}

.little-text {
    font-size: 20px;
    color: #ccc;
    writing-mode: vertical-lr;
}
</style>
