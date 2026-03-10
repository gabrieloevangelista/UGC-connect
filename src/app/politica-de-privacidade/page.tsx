import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade",
};

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-8">
                    Política de Privacidade
                </h1>
                <div className="prose prose-stone max-w-none text-stone-600 font-light">
                    <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                    
                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">1. Introdução</h2>
                    <p>
                        A UGC Connect ("nós", "nosso" ou "plataforma") está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site ou utiliza nossos serviços.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">2. Coleta de Informações</h2>
                    <p>
                        Podemos coletar informações pessoais que você nos fornece voluntariamente ao se cadastrar, preencher formulários, assinar nossa newsletter ou entrar em contato conosco. Isso pode incluir seu nome, endereço de e-mail, número de telefone, nome da empresa e outras informações relevantes.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">3. Uso das Informações</h2>
                    <p>
                        Utilizamos as informações coletadas para:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Fornecer, operar e manter nossos serviços;</li>
                        <li>Melhorar, personalizar e expandir nossa plataforma;</li>
                        <li>Compreender e analisar como você utiliza nossos serviços;</li>
                        <li>Desenvolver novos produtos, serviços, recursos e funcionalidades;</li>
                        <li>Comunicar com você, diretamente ou através de um de nossos parceiros, inclusive para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço, e para fins de marketing e promoção;</li>
                        <li>Enviar e-mails e mensagens;</li>
                        <li>Detectar e prevenir fraudes.</li>
                    </ul>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">4. Compartilhamento de Informações</h2>
                    <p>
                        Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem o seu consentimento, exceto para parceiros de confiança que nos auxiliam na operação do nosso site, na condução dos nossos negócios ou no atendimento aos nossos usuários, desde que essas partes concordem em manter essas informações confidenciais.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">5. Segurança dos Dados</h2>
                    <p>
                        Implementamos uma variedade de medidas de segurança para manter a segurança de suas informações pessoais. No entanto, lembre-se de que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">6. Seus Direitos</h2>
                    <p>
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Se desejar exercer esses direitos, entre em contato conosco através do e-mail contato@ugcconnect.com.br.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">7. Alterações nesta Política</h2>
                    <p>
                        Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">8. Contato</h2>
                    <p>
                        Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo e-mail contato@ugcconnect.com.br.
                    </p>
                </div>
            </div>
        </div>
    );
}
