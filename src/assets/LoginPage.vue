<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-background">
    <!-- Abstract Shapes -->
    <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-light/30 blur-3xl"></div>
    <div class="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
      <div>
        <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
                   class="relative block w-full appearance-none rounded-xl border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   class="relative block w-full appearance-none rounded-xl border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                   placeholder="Password">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox"
                   class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark">Forgot your password?</a>
          </div>
        </div>

        <div>
          <button type="submit"
                  class="group relative flex w-full justify-center rounded-xl border border-transparent bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const handleLogin = () => {
  console.log('Logging in...');
  // Handle login logic here
};
</script>