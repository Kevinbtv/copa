import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Kevin Tavares',
      email: 'kevintavares@gmail.com',
      avatarUrl: 'https://github.com/kevinbtv.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Bolão Maroto',
      code: 'BM123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  const firstGame = await prisma.game.create({
    data: {
      date: '2022-11-10T12:00:00.547Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  const secondGame = await prisma.game.create({
    data: {
      date: '2022-11-11T12:00:00.547Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()