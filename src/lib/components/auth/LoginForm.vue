<template>
  <login-wrapper>
    <!--<template v-slot:toolbar-items>-->
    <!--<v-btn icon @click="logIn('google')">-->
    <!--<v-icon small>fab fa-google-plus-g</v-icon>-->
    <!--</v-btn>-->
    <!--</template>-->

    <template v-slot:default>
      <span class="error--text text-center">{{ error }}</span>

      <v-form>
        <da-phone-field
          @keyup.enter="logIn()"
          :value="login"
          @input="$emit('update:login', $event)"
          v-validate="'phone|required'"
          :error-messages="errors && errors.first('login')"
          name="login"
          label="Телефон *"
          prepend-icon="fa-user"
        ></da-phone-field>

        <v-slide-y-transition hide-on-leave>
          <v-text-field
            v-show="loginOnPass"
            @keyup.enter="logIn()"
            id="password"
            label="Пароль"
            :value="pass"
            @input="$emit('update:pass', $event)"
            v-validate="loginOnPass ? 'required' : ''"
            :error-messages="(errors && errors.first('pass')) || error"
            name="pass"
            prepend-icon="fa-lock"
            type="password"
          ></v-text-field>
        </v-slide-y-transition>
      </v-form>
    </template>

    <template v-slot:actions>
      <div class="login-form-actions">
        <v-btn
          class="login__enter"
          color="primary"
          rounded
          :loading="loading"
          @click="$emit('click:login')"
          >{{ loginOnPass ? 'Войти' : 'Далее' }}
        </v-btn>
        <span class="caption grey--text mt-2">* Введите номер телефона</span>
        <v-btn
          class="login__mode"
          text
          tile
          small
          color="info"
          @click="
            loginOnPass = !loginOnPass
            $emit('update:pass')
          "
          >{{ loginOnPass ? 'Забыли пароль?' : 'Войти по паролю' }}
        </v-btn>
        <slot name="bottom"></slot>
      </div>
    </template>
  </login-wrapper>
</template>

<script>
import LoginWrapper from '~~/components/auth/LoginWrapper.vue'

export default {
  inject: ['$validator'],
  components: {
    LoginWrapper
  },
  data() {
    return {
      loginOnPass: true
    }
  },
  props: {
    error: String,
    login: String,
    pass: String,
    loading: Boolean
  }
}
</script>

<style lang="scss">
.login-form-actions {
  display: flex;
  flex-direction: column;

  &__enter {
    margin-bottom: 25px;
  }

  &__mode {
    margin-bottom: 10px;
  }
}
</style>
