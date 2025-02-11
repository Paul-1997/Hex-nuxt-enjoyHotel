import Swal from "sweetalert2";

export default defineNuxtPlugin((_nuxtApp) => _nuxtApp.provide("Swal", Swal))