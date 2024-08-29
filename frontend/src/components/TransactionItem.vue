<template>
    <div class="transaction-item flex-col space-y-2.5 w-full mt-5 py-2.5">
        <div class="flex flex-row ">
            <div class="w-6">
                <img :src="transaction.spentIcon" alt="Spent Icon" width="24" height="24">
            </div>
            <div class="flex justify-center items-center px-2.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.66666 7.08333H8.33333M8.33333 7.08333L6.66666 5.41667M8.33333 7.08333L6.66666 8.75M8.33333 2.91667H1.66666M1.66666 2.91667L3.33333 1.25M1.66666 2.91667L3.33333 4.58333"
                        stroke="#B4BACC" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="w-6">
                <img :src="transaction.receivedIcon" alt="Received Icon" width="24" height="24">
            </div>
            <div class="ml-2">
                <p class="text-md font-medium">{{ transaction.spentCurrency }}{{ transaction.receivedCurrency }}</p>
            </div>
        </div>
        <div class="flex flex-row h-9 w-full space-x-0">
            <div class="flex flex-col space-y-0.5 h-full text-xs font-medium w-full">
                <p class="inline text-[#B4BACC]">Spent Amount</p>
                <p class="inline">{{ parseFloat(transaction.spentAmount.toFixed(7)) }}{{" "}}{{ transaction.spentCurrency }}
                </p>
            </div>
            <div class="flex justify-center items-center px-2.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.66666 7.08333H8.33333M8.33333 7.08333L6.66666 5.41667M8.33333 7.08333L6.66666 8.75M8.33333 2.91667H1.66666M1.66666 2.91667L3.33333 1.25M1.66666 2.91667L3.33333 4.58333"
                        stroke="#B4BACC" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="flex flex-col space-y-0.5 h-full text-xs font-medium w-full">
                <p class="inline text-[#B4BACC]">Receive Amount</p>
                <p class="inline">{{ parseFloat(transaction.receivedAmount.toFixed(7)) }}{{" "}}{{ transaction.receivedCurrency
                    }}</p>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    props: {
        transaction: {
            type: Object as PropType<any>,
            required: true,
        },
    },
});
</script>