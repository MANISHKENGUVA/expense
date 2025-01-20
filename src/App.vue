<template>
  <div class="min-h-screen w-full">
    <!-- Navigation Bar -->
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link 
              to="/" 
              class="flex items-center space-x-2 text-white hover:text-blue-100"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span class="font-medium">Home</span>
            </router-link>
          </div>
          <div class="text-xl font-bold">Shared Trip Expenses</div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>