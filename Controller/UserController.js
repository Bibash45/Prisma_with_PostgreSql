import prisma from "../DB/db.config.js";

export const fetchUser = async (req, res) => {
  const users = await prisma.user.findMany({

    include: {
      post: {
        select: {
          title: true,
          comment_count: true,
          description: true,
        }
      },
      comment: true,
      // _count: {
      //   select: {
      //     post: true,
      //     comment: true
      //   }

      // },
    }
  });
  return res.status(200).json({
    success: true,
    data: users,
  });

}

// Show user
export const showUser = async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  })
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })
  }
  return res.status(200).json({
    success: true,
    data: user
  })
}

export const createUser = async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (findUser) {
    return res.status(400).json({
      success: false,
      message: "email already exists!, please use another email.",
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return res.status(200).json({
    success: true,
    message: "User created successfully",
  });
};

// Update the user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    password
  } = req.body;

  await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      name,
      email,
      password
    }
  })

  return res.status(200).json({
    success: true,
    message: "User updated successfully"
  })
}

// Delete the user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await prisma.user.delete({
    where: {
      id: Number(userId)
    }
  })
  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  })
}



