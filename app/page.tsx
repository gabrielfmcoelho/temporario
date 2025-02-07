"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorDivider } from "@/components/ColorDivider"
import { Card } from "@/components/ui/card"
import techGuideData from "@/data/tech-guide-data.json"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { ArrowLeft } from "lucide-react"
import Roadmap from "@/components/Roadmap"

type Topic = {
  name: string
  area: string
  nickname: string
}

export default function Home() {
  const [selectedArea, setSelectedArea] = useState("Todos")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const filteredTopics =
    selectedArea === "Todos"
      ? techGuideData.topics
      : techGuideData.topics.filter((topic: Topic) => topic.area === selectedArea)

  const handleDownloadPdf = async () => {
    const element = document.getElementById("pdf-content")
    if (!element) return

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("solucoes_digitais.pdf")
  }

  const handleTopicClick = (nickname: string) => {
    setSelectedTopic(nickname)
  }

  const handleBack = () => {
    setSelectedTopic(null)
  }

  const topicData = selectedTopic
    ? techGuideData.topicDetails[selectedTopic as keyof typeof techGuideData.topicDetails]
    : null

  return (
    <main id="pdf-content" className="min-h-screen bg-white text-gray-800">
      <ColorDivider />
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <Image src="/Logo SEAD (2).png" alt="TechGuide.sh" width={450} height={450} className="mx-auto my-4 lg:mb-12 max-md:w-2/3" />
        <h1 className="mb-4 mx-auto text-center text-3xl font-bold leading-tight text-blue sm:text-4xl md:text-5xl lg:text-6xl">
          Soluções Digitais
          <br className="sm:inline" />
          em Desenvolvimento
          <br className="sm:inline" />
          <span className="text-green">
            2025
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center sm:text-lg text-gray-600">
          Esta pagina contém informações sobre as soluções digitais em desenvolvimento para o ano de 2025 pela SEAD, sob gerencia da NTGD e suas fabricas de software parceiras.
          <br />
          <Button variant={"ghost"} onClick={handleDownloadPdf} className="mx-auto mt-2 text-blue hover:bg-yellow/50 hover:text-white">
            Baixar PDF
          </Button>
        </p>

        <Tabs value={selectedArea} onValueChange={setSelectedArea} className="mb-14 sm:mb-14">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent">
            {techGuideData.techAreas.map((area) => (
              <TabsTrigger
                key={area}
                value={area}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-gray-600 transition-colors hover:bg-gray-100 data-[state=active]:bg-blue data-[state=active]:text-white"
              >
                {area}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTopics.map((topic: Topic) => (
            <div key={topic.name} onClick={() => handleTopicClick(topic.nickname)}>
              <Card className="border-gray-200 bg-white p-4 sm:p-6 text-center transition-colors hover:bg-gradient-to-r from-blue to-blue/60 hover:shadow-md cursor-pointer">
                <h3 className="text-base sm:text-lg font-medium hover:font-semibold hover:text-white text-gray-800">{topic.name}</h3>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {selectedTopic && topicData && (
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-4 mx-auto text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">{topicData.title}</h1>
            <p className="my-8 text-center sm:text-lg text-gray-600">{topicData.description}</p>
          </div>

          <div className="my-8 sm:mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-gray-100 p-4">
            {Object.entries(topicData.metadata).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xs sm:text-sm font-semibold text-gray-500">{key}</p>
                <p className="text-sm sm:text-base font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center border-b border-gray-200 py-4"/>

          <h2 className="mt-12 mb-4 text-2xl font-bold text-center">Equipe</h2>
          <div className="my-8 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {topicData.columns.map((column, index) => (
              <div key={index} className="justify-center align-middle p-4 bg-white rounded-lg shadow-sm">
                <h3 className={`mb-3 sm:mb-4 text-lg sm:text-medium text-center font-bold bg-${column.color} rounded-lg p-2 text-white`}>{column.title}</h3>
                <div className="grid gap-3 sm:gap-4">
                  <div className={`grid grid-cols-1 sm:grid-cols-${column.items.length >1 ? "2" : "3"} gap-3 sm:gap-4`}>
                    {column.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`${item.span === 2 ? "sm:col-span-2" : ""} rounded-lg ${
                          item.highlight ? `bg-${column.color} text-white` : "border border-gray-200 bg-white"
                        } p-3 sm:p-4 shadow-sm`}
                      >
                        <h3 className="text-sm text-center font-medium">{item.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center border-b border-gray-200 py-4"/>

          {/* Roadmap Section */}
          <h2 className="mt-12 mb-4 text-2xl font-bold text-center">Etapas do Projeto</h2>
          <Roadmap roadmapSteps={topicData.roadmapSteps || []} />
        </section>
      )}
    </main>
  )
}