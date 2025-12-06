"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Mail, Users, BookOpen, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import emailjs from '@emailjs/browser'

const contactFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  subject: z.string().min(5, {
    message: "Le sujet doit contenir au moins 5 caractères.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
})

export function ContactSection() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      await emailjs.send(
        'service_w56969n',
        'template_i454ioq',
        {
          from_name: `${values.firstName} ${values.lastName}`,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
          to_email: 'support@afri-fek.org'
        },
        'XyUzH97_CifkN4obA'
      );
      
      alert('Message envoyé avec succès!');
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#4d7c0f]">Nous Contacter</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Besoin d'aide ou des questions ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Notre équipe est là pour vous accompagner dans vos recherches et vous aider à tirer le meilleur parti d'Afri-Fek. Choisissez le meilleur moyen de nous contacter.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Options */}
          <div className="space-y-6 order-2 lg:order-1">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#fbbf24]" />
                  Communauté Scientifique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Rejoignez notre communauté active de chercheurs pour des discussions et collaborations.
                </p>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Rejoindre la Communauté
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#fbbf24]" />
                  Support Technique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Signalez des problèmes, demandez des fonctionnalités ou obtenez de l'aide technique.
                </p>
                <Link href="/support">
                  <Button variant="outline" size="sm" className="cursor-pointer ">
                    Contacter le Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#fbbf24]" />
                  Guide d'Utilisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Consultez nos guides complets, tutoriels et documentation de la plateforme.
                </p>
                <Link href="/guide">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Voir la Documentation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 ">
                  <Mail className="h-5 w-5 text-[#fbbf24]" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sujet</FormLabel>
                          <FormControl>
                            <Input placeholder="Demande d'information, rapport de bug, question générale..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Dites-nous comment nous pouvons vous aider avec Afri-Fek..."
                              rows={10}
                              className="min-h-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-[#4d7c0f] hover:bg-[#3f6212] cursor-pointer">
                      Envoyer le Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
