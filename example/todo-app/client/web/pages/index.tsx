/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/react-in-jsx-scope */
import Head from 'next/head';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  HStack,
  Pressable,
  Icon,
  Text,
  ProgressBar,
  AddIcon,
  Hoverable,
  Checkbox,
  Button,
  Input,
  CheckIcon,
  TrashIcon,
  Link,
} from '@/components';
import { getCompletedTasks, getDay } from '@/utils';
import ClientSDK from '@project/client-sdk';
console.log(ClientSDK.providers.get('db').user);

// import { Box, Text } from "../components";

const Meta = () => {
  return (
    <Head>
      <title>Create Gluestack App</title>
      <meta name="description" content="Generated by node glue add web" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

const Todo = () => {
  // console.log('herrreee');
  async function test() {
    console.log(await ClientSDK.providers.get('db').prisma.user.findMany());
  }
  // async function addUser() {
  //   console.log(
  //     await ClientSDK.providers.get('db').prisma.user.create({
  //       data: {
  //         // name: 'Alice',
  //         title: 'CEO',
  //         votes: 3,
  //         status: false,
  //       },
  //     })
  //   );
  // }
  const [item, setItem] = useState('');
  const [todos, setTodos] = useState();
  // const [swipedItemId, setSwipedItemId] = useState(null);
  const [lastItemSelected, setLastItemSelected] = useState(false);
  useEffect(() => {
    async function getTodos() {
      try {
        const todos = await ClientSDK.providers
          .get('db')
          .prisma.todosList.findMany();
        console.log(todos, 'Todooosss');
        setTodos(todos);
      } catch (err) {
        console.log(err, 'error');
      }
    }
    getTodos();
  }, []);

  async function seedTodos() {
    console.log(await ClientSDK.functions.multiply(), 'User added');
  }

  async function getTodos() {
    try {
      console.log(await ClientSDK.functionsTest.add(2, 3));
      console.log(await ClientSDK.functions.test.test(), 'User added');
    } catch (err) {
      console.error(err, 'error');
    }
  }

  const addTodo = async () => {
    // const lastTodo = todos[todos.length - 1];

    // if (lastTodo.task !== '') {
    //   setTodos([
    //     ...todos,
    //     {
    //       id: shortid.generate(),
    //       task: '',
    //       completed: false,
    //     },
    //   ]);
    //   setItem('');
    //   setLastItemSelected(false);
    // }
    await ClientSDK.providers.get('db').prisma.todosList.create({
      data: {
        // name: 'Alice',
        task: '',
        completed: false,
      },
    });
  };

  return (
    <Box m="$10">
      <Box px="$6">
        <HStack justifyContent="space-between">
          <Text color="$dark900" fontWeight="$bold" fontSize="$xl">
            {getDay()}
          </Text>
          <HStack space="md">
            <Button onPress={seedTodos} variant="outline" action="secondary">
              <Button.Text>seed user</Button.Text>
            </Button>
            <Button onPress={getTodos} variant="outline" action="secondary">
              <Button.Text>Add </Button.Text>
            </Button>
          </HStack>
        </HStack>
        <ProgressBar
          completedTasks={getCompletedTasks(
            todos,
            item != '' && lastItemSelected
          )}
          totalTasks={item !== '' && todos ? todos.length + 1 : 0}
        />
      </Box>
      {/* {todos ? (
        todos?.map((todo, index) => (
          <SwipeableContainer
            key={index}
            todo={todo}
            todos={todos}
            setTodos={setTodos}
            swipedItemId={swipedItemId}
            setSwipedItemId={setSwipedItemId}
          />
        ))
      ) : (
        <Text>No todos found</Text>
      )} */}
      <Link
        p="$2"
        sx={{
          ':hover': {
            _text: {
              color: '$primary500',
            },
          },
          'color': '$black500',
        }}
      >
        <Link.Text color="$white">testcfdgvhbj</Link.Text>
      </Link>

      <Pressable
        mb="$32"
        px="$6"
        sx={{
          '@md': {
            mb: 0,
          },
        }}
        onPress={() => {
          addTodo();
          // setTimeout(() => {
          //   inputRef.current.focus();
          // }, 100);
        }}
      >
        <HStack alignItems="center" mt="$4">
          <Icon as={AddIcon} color="$secondary600" />
          <Text ml="$2" fontSize="$sm" color="$textDark50">
            Add Task
          </Text>
        </HStack>
      </Pressable>
    </Box>
  );
};

const SwipeableContainer = ({ todo, todos, setTodos, swipedItemId }: any) => {
  const [isOpen] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [editItem, setEditItem] = useState(todo.task);
  const [editItemId, setEditItemId] = useState(null);
  const swipeableRef: any = useRef(null);
  const inputRef: any = useRef(null);

  useEffect(() => {
    if (swipedItemId !== null && swipedItemId !== todo.id) {
      swipeableRef.current.close();
    }
  });

  const handleDelete = (id: any) => {
    const updatedTodos = todos.filter((todo: any) => todo.id !== id);
    setTodos(updatedTodos);
  };
  const toggleCheckbox = (id: any) => {
    const updatedTodos = todos.map((todo: any) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };
  const handleEdit = (id: any) => {
    setEditItemId(null);
    if (editItem !== '') {
      const updatedTodos = todos.map((todo: any) =>
        todo.id === id ? { ...todo, task: editItem } : todo
      );
      setTodos(updatedTodos);
    } else {
      setEditItem(todo.task);
    }
  };
  const handleDoubleTap = () => {
    const now = Date.now();
    if (!lastTap) {
      // @ts-ignore
      setLastTap(now);
    } else {
      if (now - lastTap < 700) {
        setEditItemId(todo.id);
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
      setLastTap(null);
    }
  };

  return (
    <Hoverable
      px="$6"
      py="$2"
      minHeight={38}
      flexDirection="row"
      bg={isOpen ? '$backgroundDark700' : '$backgroundDark900'}
      key={todo.id}
      alignItems="center"
      focusable={false}
      onPress={handleDoubleTap}
    >
      <Checkbox
        aria-label={todo.id}
        isChecked={todo.completed}
        value={todo.task}
        onChange={() => toggleCheckbox(todo.id)}
        size="sm"
        w="$full"
        borderColor="transparent"
      >
        <Checkbox.Indicator>
          <Checkbox.Icon color="$backgroundDark900" as={CheckIcon} />
        </Checkbox.Indicator>
        <Input
          sx={{
            ':focus': {
              _web: {
                boxShadow: 'none',
              },
            },
          }}
          borderWidth="$0"
          w="$full"
          h={22}
        >
          <Input.Input
            pl="$2"
            editable={!isOpen && editItemId === todo.id}
            value={editItem}
            color="$textDark50"
            fontSize="$sm"
            fontWeight="$normal"
            textDecorationLine={todo.completed ? 'line-through' : 'none'}
            onChangeText={(val) => setEditItem(val)}
            onSubmitEditing={() => handleEdit(todo.id)}
            onBlur={() => handleEdit(todo.id)}
            autoComplete="off"
            ref={inputRef}
          />
        </Input>
      </Checkbox>
      <Button
        zIndex={9999}
        h="$full"
        p="$3"
        bg="$error900"
        borderRadius="$none"
        onPress={() => handleDelete(todo.id)}
        focusable={false}
      >
        <Icon as={TrashIcon} name="trash" size={18} />
      </Button>
    </Hoverable>
  );
};
const Home: NextPage = () => {
  return (
    <div>
      <Meta />
      <Todo />
      {/* <Container /> */}
    </div>
  );
};

export default Home;
