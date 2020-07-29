import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom'

import * as Yup from 'yup';
import { FiUser, FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import {useToast} from '../../hooks/toast'
import api from '../../services/api'

import getValidationError from '../../utils/getValidationErrors';
import LogoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Background, Content, AnimationContainer } from './styles';

interface SignUpFormData{
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const {addToast} = useToast()
  const history = useHistory()

  const formRef = useRef<FormHandles>(null);
  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('E-mail inválido'),
        password: Yup.string().min(6, 'A senha deve ter no minimo 6 digitos'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data)

      history.push('/')

      addToast({
        type: 'success',
        title: 'Cadastro efetivado',
        description: 'usuario Cadastrado com sucesso',
      })
    } catch (err) {
      if( err instanceof Yup.ValidationError){
        const errors = getValidationError(err);

        formRef.current?.setErrors(errors);

        return;
      }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        })

    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="Email" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};
export default SignUp;
