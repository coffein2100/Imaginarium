import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser,useSupabaseClient } from '@supabase/auth-helpers-react'; //проверка  пользователя через компонент авторизации supabase
import {v4 as uuidv4} from 'uuid';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const CDNURL = "https://frhttueohohfxedjbtun.supabase.co/storage/v1/object/public/images/";

function App() {
  const [email, setEmail] = useState(""); //задаем изначальное состояние email
  const user = useUser(); //проверка наличия пользователя
  const supabase = useSupabaseClient();
  const [images, setImages] = useState([]);


async function getImages() {
  const { data, error} = await supabase
  .storage
  .from('images')
  .list(user?.id + "/", {
    limit: 100,
    offset:0,
    sortBy: {column: "name", order: "asc"}
  });
  if (data !==null){
    setImages(data);
  } else {
    alert("Ошибка загрузки фото");
    console.log(error);
  }
}
useEffect(()=> {
  if(user){
    getImages();
  }
}, [user])

async function magicLinkLogin () { //функция авторизации в supabase
  const { data, error} = await supabase.auth.signInWithOtp({
    email: email
  });
  if (error){
    alert("Ошибка подключения. Проверьте, что ввели корректный адресс Email");
    console.log(error);
  } else {
    alert("Ссылка для входа отправлена на указанную почту");
  }
}

async function signOut() { //функция выхода
  const { error } = await supabase.auth.signOut();
}
async function uploadImage(e) {
  let file = e.target.files [0];

  const { data, error } = await supabase
    .storage
    .from('images')
    .upload(user.id + "/" + uuidv4(), file)

    if(data) {
      getImages();
    } else {
      console.log(error);
    }
}

async function deleteImage(imageName) {
 const { error } = await supabase
  .storage
  .from('images')
  .remove([user.id + "/" + imageName])

  if(error){
    alert(error);
  } else {
    getImages();
  }
}

  return (
    <Container align="center" className='container-sm mt-4'> {/* начаьная загрузка */}
      {
        user === null ?
        <>
          <h1>Добро пожаловать в Имагинариум</h1>
          <Form>
            <Form.Group className="mb-3" style={{maxWidth: "500px"}}> {/*хранение текстового ввода*/}
              <Form.Label>
                Введите свой email для входа в приложение
              </Form.Label>
              <Form.Control 
                type="email"
                placeholder='Введите email'
                onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" onClick={()=> magicLinkLogin()}>
              Получить ссылку для входа
            </Button>
          </Form>
        </>
        :
        <>
        <h1>С возвращением в Имагинариум</h1>
        <Button onClick={()=> signOut()}>Выход</Button>
        <p>Текущий пользователь: {user.email}</p>
        <p>Нажмите на кнопку, чтобы добавить изображение в галерею</p>
        <Form.Group className='mb-3' style={{maxWidth: "500px"}}>
          <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => uploadImage(e)} />
        </Form.Group>
        <hr/>
        <h3>Ваши фото</h3>
        <Row xs={1} md={3} className="g-4">
          {images.map((Image)=>{
            return (
              <Col key={CDNURL + user.id + "/" + Image.name}>
                <Card>
                  <Card.Img variant='top' src={CDNURL + user.id + "/" + Image.name}/>
                  <Card.Body>
                    <Button variant='danger' onClick={()=> deleteImage(Image.name)}>Удалить фото</Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
        </>
      }
    </Container>
  );
}

export default App;
