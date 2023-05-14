<template>
    <div class="page">
        <div class="sign-card">
            <div class="background-img">
                <img :src="signBackground" alt="签到">
            </div>
            <div class="title">11
            </div>
            <div class="content">
                签到成功
                <div class="text-content">
                    <div class="text2">
                        <div class="little-text horizon-text">
                            好感度 + {{ query.random_num }}
                        </div>
                        <div class="little-text horizon-text">
                            上次签到时间：{{ query.checkin_time_last_str }}
                        </div>
                        <div class="little-text horizon-text">
                            当前好感度：{{ query.impression }} {{ height }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import signBackground2 from './bg2.jpg'
import signBackground3 from './bg3.jpg'
import signBackground4 from './bg4.png'

// signBackground中随机选择一个作为背景
const signBackground = [signBackground2, signBackground3, signBackground4][Math.floor(Math.random() * 3)]

let query: any = ref({
    random_num: 0,
    checkin_time_last_str: '',
    impression: 0,
})
query = useRouter().currentRoute.value.query
console.log(query)
let height = ref(0)

onMounted(() => {
    // 获取图片高度
    const img = document.querySelector('.background-img img')
    console.log(img);
    
    height.value = img.clientHeight
    console.log(height.value);
    
})
</script>

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
    /* scale: 0.3; */
}

.sign-card {
    width: 80vw;
    height: 40vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    object-fit: cover;
    overflow: hidden;
    position: relative;
}

.background-img {
    position: absolute;
    width: 80vw;
    z-index: -1;
    display: flex;
    justify-content: center;
    object-fit: cover;
    overflow: hidden;
}

.background-img img {
    width: 100%;
    object-fit: cover;
}

.title {
    width: 100%;
    flex: 4;
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 3vw;
    flex: 6;
    font-weight: 700;
    color: #000;
    background-color: rgba(243, 243, 243, 0.8);
}

.text-content {
    width: 100%;
}

.little-text {
    width: 100%;
    font-size: 1vw;
}
</style>
