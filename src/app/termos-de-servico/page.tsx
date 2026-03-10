import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Serviço",
};

export default function TermsOfService() {
    return (
        <div className="bg-white min-h-screen py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-8">
                    Termos de Serviço
                </h1>
                <div className="prose prose-stone max-w-none text-stone-600 font-light">
                    <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                    
                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e usar a plataforma UGC Connect (&quot;nós&quot;, &quot;nosso&quot; ou &quot;plataforma&quot;), você concorda em cumprir e ficar vinculado a estes Termos de Serviço (&quot;Termos&quot;). Se você não concordar com qualquer parte destes Termos, não poderá acessar ou usar nossos serviços.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">2. Descrição dos Serviços</h2>
                    <p>
                        A UGC Connect é uma plataforma que conecta marcas a criadores de conteúdo UGC (User Generated Content). Fornecemos ferramentas para facilitar a criação, gestão e entrega de conteúdo.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">3. Contas de Usuário</h2>
                    <p>
                        Para acessar determinados recursos da plataforma, você pode ser solicitado a criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">4. Conteúdo do Usuário</h2>
                    <p>
                        Você mantém todos os direitos sobre o conteúdo que envia, publica ou exibe através da nossa plataforma. Ao enviar conteúdo, você concede à UGC Connect uma licença mundial, não exclusiva, isenta de royalties para usar, reproduzir, modificar, adaptar, publicar, traduzir e distribuir tal conteúdo em qualquer mídia.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">5. Propriedade Intelectual</h2>
                    <p>
                        A plataforma e seu conteúdo original (excluindo o Conteúdo do Usuário), recursos e funcionalidades são e permanecerão de propriedade exclusiva da UGC Connect e de seus licenciadores.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">6. Conduta do Usuário</h2>
                    <p>
                        Você concorda em não usar a plataforma para qualquer finalidade ilegal ou proibida por estes Termos. Você concorda em não interferir ou interromper a integridade ou o desempenho da plataforma ou dos dados nela contidos.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">7. Limitação de Responsabilidade</h2>
                    <p>
                        Em nenhuma circunstância a UGC Connect, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">8. Rescisão</h2>
                    <p>
                        Podemos encerrar ou suspender seu acesso imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">9. Lei Aplicável</h2>
                    <p>
                        Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem levar em conta o conflito de disposições legais.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">10. Alterações</h2>
                    <p>
                        Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.
                    </p>

                    <h2 className="text-2xl text-stone-800 mt-8 mb-4">11. Contato</h2>
                    <p>
                        Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail contato@ugcconnect.com.br.
                    </p>
                </div>
            </div>
        </div>
    );
}
