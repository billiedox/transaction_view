<template>
  <div class="flex flex-col w-custom-sm mt-8 justify-center px-5 pt-5 pb-7.5 border-gray-500 border-solid">
    <h1 class="text-xl font-bold">Latest Transactions</h1>

    <form @submit.prevent="handleSearch" class="mb-6 flex flex-col space-y-2 justify-center">
      <input v-model="searchAddress" type="text" placeholder="Search by address"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input v-model="searchChain" type="text" placeholder="Search by chain"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div class="flex flex-row space-x-2 justify-center">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Search
        </button>
        <button @click="clearSearch" type="button"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          Clear
        </button>
      </div>
    </form>

    <div v-if="errorMessage" class="error-message mb-2.5 text-red-500">
      <p>{{ errorMessage }}</p>
      <div class="flex justify-center mt-3">
        <button @click="retryFetch"
          class="px-2.5 py-1.5 bg-red-500 text-white border-0 cursor-pointer rounded-md text-sm hover:bg-red-600">Retry</button>
      </div>
    </div>

    <div v-else>
      <TransactionItem v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
    </div>

    <div ref="loadMoreTrigger" class="load-more-trigger h-5">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { getTransactions } from '../services/transactionService';
import TransactionItem from './TransactionItem.vue';

export default defineComponent({
  components: { TransactionItem },
  setup() {
    const transactions = ref(<any>[]);
    const page = ref(1);
    const isLoading = ref(false);
    const searchAddress = ref('');
    const searchChain = ref('');
    const errorMessage = ref<string | null>(null); // Error message state
    const TIMEOUT_DURATION = 10000; // Timeout duration in ms (10 seconds)

    // Timeout helper function
    const fetchWithTimeout = (timeout: number, fetchPromise: Promise<any>) => {
      return Promise.race([
        fetchPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
      ]);
    };

    const fetchTransactions = async () => {
      if (isLoading.value) return;
      isLoading.value = true;
      errorMessage.value = null; // Clear previous error

      try {
        const data = await fetchWithTimeout(TIMEOUT_DURATION, getTransactions(searchAddress.value, searchChain.value, page.value));
        transactions.value = [...transactions.value, ...data];
      } catch (error: any) {
        if (error.message === 'Request timed out') {
          errorMessage.value = 'Request timed out. Please try again.'; // Set timeout error message
        } else {
          errorMessage.value = 'Failed to load transactions. Please try again.'; // Set other error message
        }
      } finally {
        isLoading.value = false;
      }
    };

    const handleSearch = () => {
      transactions.value = []; // Clear previous results
      page.value = 1; // Reset page

      console.log('Search Values:', { searchAddress: searchAddress.value, searchChain: searchChain.value });

      fetchTransactions();
    };

    const clearSearch = () => {
      searchAddress.value = '';
      searchChain.value = '';
      transactions.value = []; // Clear previous results
      page.value = 1; // Reset page
      fetchTransactions();
    };

    const loadMore = () => {
      if (!errorMessage.value) {
        page.value++;
        fetchTransactions();
      }
    };

    const retryFetch = () => {
      page.value = 1; // Reset the page counter
      transactions.value = []; // Clear existing transactions
      fetchTransactions(); // Retry fetching transactions
    };

    onMounted(() => {
      fetchTransactions(); // Load initial transactions

      // Infinite scrolling using Intersection Observer
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !errorMessage.value) {
          loadMore();
        }
      });

      observer.observe(document.querySelector('.load-more-trigger') as Element);
    });

    return {
      transactions,
      searchAddress,
      searchChain,
      handleSearch,
      clearSearch,
      errorMessage,
      retryFetch,
    };
  },
});
</script>
