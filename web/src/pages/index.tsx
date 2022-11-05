import Image from "next/image"
import appPreviewImg from '../assets/app-nlw-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatars-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  poolCount: number,
  guessCount: number,
  usersCount: number,
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  const [poolCode, setPoolCode] = useState(
    'Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀'
  )

  async function createPool(e: FormEvent) {
    e.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      setPoolCode(`Parabéns, eis o seu código! ${code}`)

      await navigator.clipboard.writeText(code)

      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert('Falha ao criar')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa Logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <section className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="Avatares NLW" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </section>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            title="Escreva o nome do bolão"
            onChange={e => setPoolTitle(e.target.value)}
            value={poolTitle}
          />

          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-5">
          {poolCode}
        </p>

        <section className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100">
          <div className="flex gap-6">
            <Image src={iconCheck} alt="Icone de Check" />

            <div className="flex flex-col">
              <p className="font-bold text-2xl">+{props.poolCount}</p>
              <p>Bolões criados</p>
            </div>
          </div>
          <div className="flex justify-end gap-6">
            <Image src={iconCheck} alt="Icone de Check" />

            <div className="flex flex-col">
              <p className="font-bold text-2xl">+{props.guessCount}</p>
              <p>Palpites enviados</p>
            </div>
          </div>
        </section>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW copa" quality={100} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    }
  }
}
